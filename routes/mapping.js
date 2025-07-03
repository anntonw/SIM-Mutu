const express = require('express');
const router = express.Router();
const { MappingLokasiPertanyaan } = require('../models');
const { Pertanyaan } = require('../models');

router.get('/', async (req, res) => {
  const { lokasiId, kategoriId } = req.query;

  if (!lokasiId || !kategoriId) {
    return res.status(400).json({ error: 'lokasiId & kategoriId wajib diisi' });
  }

  // 1️⃣ Cari semua pertanyaan dari kategori ini
  const pertanyaanKategori = await Pertanyaan.findAll({
    where: { kategoriId },
    attributes: ['id']
  });
  const kategoriPertanyaanIds = pertanyaanKategori.map(p => p.id);

  // 2️⃣ Cari mapping yang match lokasiId & pertanyaan dari kategori itu
  const mapping = await MappingLokasiPertanyaan.findAll({
    where: {
      lokasiId,
      pertanyaanId: kategoriPertanyaanIds
    }
  });

  const mappedIds = mapping.map(m => m.pertanyaanId);

  res.json({ mappedIds });
});

router.post('/', async (req, res) => {
  const { lokasiId, pertanyaanIds, kategoriId } = req.body;

  if (!lokasiId || !Array.isArray(pertanyaanIds) || !kategoriId) {
    return res.status(400).json({ error: 'lokasiId, kategoriId & pertanyaanIds wajib diisi' });
  }

  // 1️⃣ Cari semua pertanyaan ID untuk kategori ini
  const pertanyaanKategori = await Pertanyaan.findAll({
    where: { kategoriId },
    attributes: ['id']
  });
  const kategoriPertanyaanIds = pertanyaanKategori.map(p => p.id);

  // 2️⃣ Hapus mapping lama yang match lokasiId + pertanyaanId yang match kategori ini
  await MappingLokasiPertanyaan.destroy({
    where: {
      lokasiId,
      pertanyaanId: kategoriPertanyaanIds
    }
  });

  // 3️⃣ Tambah mapping baru
  const cleanIds = pertanyaanIds.filter(Boolean);
  for (const pid of cleanIds) {
    await MappingLokasiPertanyaan.create({
      lokasiId,
      pertanyaanId: pid
    });
  }

  res.json({ message: 'Mapping berhasil disimpan!' });
});

module.exports = router;
