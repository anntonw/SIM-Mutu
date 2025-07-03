const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

const router = express.Router();

// Login form
router.get('/login', (req, res) => {
  res.sendFile('login.html', { root: './views' });
});

router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.json(req.session.user);
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Logout gagal!' });
    }
    res.clearCookie('connect.sid'); // opsional: hapus cookie session
    res.sendFile('login.html', { root: './views' });
  });
});

// Handle login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });

  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role,
      lokasiId: user.lokasiId
    };
    if (user.role === 'admin') {
      res.redirect('/dashboard');
    } else {
      res.redirect('/dashboard');
    }
  } else {
    res.send('Login gagal');
  }
  
});

router.get('/dashboard', (req, res) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    res.sendFile('dashboard.html', { root: './views' });
  });

  router.get('/master-lokasi', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
      return res.redirect('/login');
    }
    res.sendFile('master-lokasi.html', { root: './views' });
  });

  router.get('/master-user', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
      return res.redirect('/login');
    }
    res.sendFile('master-user.html', { root: './views' });
  });

   router.get('/master-kategori', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
      return res.redirect('/login');
    }
    res.sendFile('master-kategori.html', { root: './views' });
  });

     router.get('/master-pertanyaan', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
      return res.redirect('/login');
    }
    res.sendFile('master-pertanyaan.html', { root: './views' });
  });

      router.get('/mapping', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
      return res.redirect('/login');
    }
    res.sendFile('mapping.html', { root: './views' });
  });

      router.get('/form-nilai', (req, res) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    res.sendFile('form-nilai.html', { root: './views' });
  });
  
  
  

module.exports = router;
