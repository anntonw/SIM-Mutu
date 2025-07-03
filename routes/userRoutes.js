const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const router = express.Router();
const { User } = require('../models');
const { Lokasi } = require('../models');

// GET: pagination + search + sort
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const sort = req.query.sort || 'username';
    const order = req.query.order || 'ASC';
    const search = req.query.search || '';

    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where.username = { [Op.like]: `%${search}%` };
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      include: [{ model: Lokasi }],
      limit,
      offset,
      order: [[sort, order]]
    });

    res.json({ data: rows, total: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST: create user
router.post('/', async (req, res) => {
  try {
    const { username, password, role, lokasiId } = req.body;

    const hashed = bcrypt.hashSync(password, 10);

    const user = await User.create({
      username,
      password: hashed,
      role,
      lokasiId
    });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PUT: update user
router.put('/:id', async (req, res) => {
  try {
    const { username, password, role, lokasiId } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });

    user.username = username;
    user.role = role;
    user.lokasiId = lokasiId;

    // Jika password diisi, hash baru
    if (password && password.trim() !== '') {
      user.password = bcrypt.hashSync(password, 10);
    }

    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE: delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.json({ message: 'User dihapus' });
    } else {
      res.status(404).json({ error: 'User tidak ditemukan' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
