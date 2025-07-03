const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const Lokasi = require('./models/lokasi');
const lokasiRoutes = require('./routes/lokasiRoutes');
const userRoutes = require('./routes/userRoutes');
const kategoriRoutes = require('./routes/kategoriRoutes');
const pertanyaanRoutes = require('./routes/pertanyaanRoutes');
const mappingRoutes = require('./routes/mapping');
const nilaiRoutes = require('./routes/nilaiRoutes');
const rekapRoutes = require('./routes/rekapRoutes');



dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(session({
  secret: 'rahasia',
  resave: false,
  saveUninitialized: true
}));
app.use('/api/lokasi', lokasiRoutes);

app.use('/api/user', userRoutes);

app.use('/api/kategori', kategoriRoutes);

app.use('/api/pertanyaan', pertanyaanRoutes);
app.use('/api/mapping', mappingRoutes);
app.use('/api/nilai', nilaiRoutes);
app.use('/api/rekap', rekapRoutes);

app.use('/', authRoutes);

sequelize.sync().then(() => {
  app.listen(3000, () => console.log('Server jalan di http://localhost:3000'));
});
