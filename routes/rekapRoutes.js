const express = require('express');
const router = express.Router();
const { Nilai, Pertanyaan, Lokasi } = require('../models');
const { Op } = require('sequelize');

router.get('/', async (req, res) => {
  const { kategoriId, bulan } = req.query;

  if (!kategoriId || !bulan) {
    return res.status(400).json({ error: 'kategoriId & bulan wajib' });
  }

  // Dapatkan user dari session
  const user = req.session.user;

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: User tidak login' });
  }

  const [tahun, bulanNum] = bulan.split('-');
  const lastDay = new Date(tahun, bulanNum, 0).getDate();

  const tglAwal = `${tahun}-${bulanNum}-01`;
  const tglAkhir = `${tahun}-${bulanNum}-${String(lastDay).padStart(2, '0')}`;

  // Ambil pertanyaan by kategori
  const pertanyaan = await Pertanyaan.findAll({
    where: { kategoriId },
    include: [{
      model: Lokasi,
      where: { id: req.session.user.lokasiId },
      through: { attributes: [] }
    }],
    raw: true,
    nest: true
  });

  // Filter dasar
  const whereNilai = {
    kategoriId,
    tanggal: { [Op.between]: [tglAwal, tglAkhir] }
  };

  // Kalau user BUKAN admin, filter berdasarkan lokasi user login
  if (user.role !== 'admin') {
    whereNilai.lokasiId = user.lokasiId; // Pastikan kolom ini ada di model Nilai!
  }

  // Ambil data nilai sesuai filter
  const nilai = await Nilai.findAll({
    where: whereNilai,
    raw: true
  });

  // Buat rekap map
  const rekap = {};
  nilai.forEach(n => {
    if (!rekap[n.pertanyaanId]) {
      rekap[n.pertanyaanId] = {};
    }
    if (!rekap[n.pertanyaanId][n.tanggal]) {
      rekap[n.pertanyaanId][n.tanggal] = { numerator: 0, denumerator: 0 };
    }
    rekap[n.pertanyaanId][n.tanggal].numerator += n.numerator;
    rekap[n.pertanyaanId][n.tanggal].denumerator += n.denumerator;
  });

  res.json({ pertanyaan, rekap });
});

module.exports = router;
