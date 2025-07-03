// routes/nilaiRoutes.js
const express = require('express');
const router = express.Router();
const { Nilai } = require('../models');

router.get('/', async (req, res) => {
  const { kategoriId, tanggal } = req.query;
  const lokasiId = req.session.user.lokasiId;

  const nilai = await Nilai.findAll({
    where: {
      kategoriId,
      tanggal,
      lokasiId: lokasiId // filter lokasi user!
    }
  });

  res.json(nilai);
});

router.post('/', async (req, res) => {
  try {
    const { tanggal, kategoriId, nilai } = req.body;
    const lokasiId = req.session.user.lokasiId; // pastikan ini ada di session
    const userId = req.session.user.id; // pastikan ini ada di session

    for (const n of nilai) {
      // Cek apakah sudah ada data
      const existing = await Nilai.findOne({
        where: {
          tanggal,
          kategoriId,
          lokasiId,
          pertanyaanId: n.pertanyaanId
        }
      });

      if (existing) {
        // Update jika sudah ada
        existing.numerator = n.numerator;
        existing.denumerator = n.denumerator;
        await existing.save();
      } else {
        // Insert jika belum ada
        await Nilai.create({
          tanggal,
          kategoriId,
          lokasiId,
          userId,
          pertanyaanId: n.pertanyaanId,
          numerator: n.numerator,
          denumerator: n.denumerator
        });
      }
    }

    res.json({ success: true, message: 'Data berhasil disimpan atau diperbarui.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal simpan nilai' });
  }
});

module.exports = router;
