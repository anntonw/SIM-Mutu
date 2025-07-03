const express = require('express');
const multer = require('multer');
const path = require('path');
const { Op } = require('sequelize');
const { Pertanyaan } = require('../models');
const { Kategori, MappingLokasiPertanyaan, User } = require('../models');

const router = express.Router();

// Setup upload folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

/**
 * GET /api/pertanyaan
 * Support: search + kategoriId + pagination
 */
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const kategoriId = req.query.kategoriId;

    const userId = req.session.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const where = {};
    if (search) {
      where.judul = { [Op.iLike]: `%${search}%` };
    }
    if (kategoriId) {
      where.kategoriId = kategoriId;
    }

    // 👉 JOIN MappingLokasiPertanyaan
    const { rows, count } = await Pertanyaan.findAndCountAll({
      where,
      include: [
        {
          model: Kategori
        },
        {
          model: MappingLokasiPertanyaan,
          required: true, // INNER JOIN
          where: {
            lokasiId: user.lokasiId
          }
        }
      ],
      limit,
      offset,
      order: [['judul', 'ASC']]
    });

    res.json({ data: rows, total: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal memuat pertanyaan' });
  }
});

/**
 * POST /api/pertanyaan
 */
router.post(
  '/',
  upload.fields([
    { name: 'pedoman', maxCount: 1 },
    { name: 'formManual', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { judul, numerator, denumerator, kategoriId } = req.body;

      if (!judul || !kategoriId) {
        return res.status(400).json({ error: 'Judul & Kategori wajib diisi' });
      }

      const pertanyaan = await Pertanyaan.create({
        judul,
        numerator,
        denumerator,
        kategoriId,
        pedomanPath: req.files.pedoman ? req.files.pedoman[0].filename : null,
        formManualPath: req.files.formManual ? req.files.formManual[0].filename : null
      });

      res.status(201).json(pertanyaan);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Gagal membuat pertanyaan' });
    }
  }
);

/**
 * PUT /api/pertanyaan/:id
 */
router.put(
  '/:id',
  upload.fields([
    { name: 'pedoman', maxCount: 1 },
    { name: 'formManual', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const pertanyaan = await Pertanyaan.findByPk(req.params.id);
      if (!pertanyaan) {
        return res.status(404).json({ error: 'Pertanyaan tidak ditemukan' });
      }

      const { judul, numerator, denumerator, kategoriId } = req.body;

      pertanyaan.judul = judul || pertanyaan.judul;
      pertanyaan.numerator = numerator;
      pertanyaan.denumerator = denumerator;
      pertanyaan.kategoriId = kategoriId;

      if (req.files.pedoman) {
        pertanyaan.pedomanPath = req.files.pedoman[0].filename;
      }
      if (req.files.formManual) {
        pertanyaan.formManualPath = req.files.formManual[0].filename;
      }

      await pertanyaan.save();
      res.json(pertanyaan);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Gagal mengupdate pertanyaan' });
    }
  }
);

/**
 * DELETE /api/pertanyaan/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const pertanyaan = await Pertanyaan.findByPk(req.params.id);
    if (!pertanyaan) {
      return res.status(404).json({ error: 'Pertanyaan tidak ditemukan' });
    }

    await pertanyaan.destroy();
    res.json({ message: 'Pertanyaan dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menghapus pertanyaan' });
  }
});

module.exports = router;
