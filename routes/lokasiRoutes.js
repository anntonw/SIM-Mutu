const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Lokasi } = require('../models');

// Get dengan search + pagination
router.get('/', async (req, res) => {
  const { page = 1, limit = 5, search = '', sort = 'nama', order = 'ASC' } = req.query;
  const offset = (page - 1) * limit;

  const { count, rows } = await Lokasi.findAndCountAll({
    where: {
      nama: { [Op.iLike]: `%${search}%` }
    },
    order: [[sort, order]],
    limit: parseInt(limit),
    offset: parseInt(offset)
  });

  res.json({
    total: count,
    data: rows
  });
});

// Create
router.post('/', async (req, res) => {
  const { nama, alamat } = req.body;
  const lokasi = await Lokasi.create({ nama, alamat });
  res.json(lokasi);
});

// Update
router.put('/:id', async (req, res) => {
  const { nama, alamat } = req.body;
  const lokasi = await Lokasi.findByPk(req.params.id);
  lokasi.nama = nama;
  lokasi.alamat = alamat;
  await lokasi.save();
  res.json(lokasi);
});

// Delete
router.delete('/:id', async (req, res) => {
  await Lokasi.destroy({ where: { id: req.params.id } });
  res.json({ message: 'Deleted' });
});

module.exports = router;
