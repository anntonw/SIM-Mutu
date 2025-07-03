const express = require('express');
const router = express.Router();
const { Kategori } = require('../models');

// GET Kategori + search + sort + paging
router.get('/', async (req, res) => {
  const { page = 1, limit = 5, search = '', sort = 'nama', order = 'ASC' } = req.query;

  const offset = (page - 1) * limit;

  const where = search
    ? { nama: { [require('sequelize').Op.like]: `%${search}%` } }
    : {};

  const { rows, count } = await Kategori.findAndCountAll({
    where,
    order: [[sort, order]],
    limit: parseInt(limit),
    offset: parseInt(offset)
  });

  res.json({
    total: count,
    data: rows
  });
});

// POST Kategori
router.post('/', async (req, res) => {
  const { nama } = req.body;

  const kategori = await Kategori.create({ nama });

  res.json(kategori);
});

// PUT Kategori
router.put('/:id', async (req, res) => {
  const { nama } = req.body;

  const kategori = await Kategori.findByPk(req.params.id);

  if (!kategori) {
    return res.status(404).json({ error: 'Kategori tidak ditemukan' });
  }

  kategori.nama = nama;

  await kategori.save();

  res.json(kategori);
});

// DELETE Kategori
router.delete('/:id', async (req, res) => {
  const kategori = await Kategori.findByPk(req.params.id);

  if (!kategori) {
    return res.status(404).json({ error: 'Kategori tidak ditemukan' });
  }

  await kategori.destroy();

  res.json({ message: 'Kategori dihapus' });
});

module.exports = router;
