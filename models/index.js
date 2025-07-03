require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres'
  }
);

// Import model
const User = require('./user')(sequelize);
const Lokasi = require('./lokasi')(sequelize);
const Kategori = require('./kategori')(sequelize);
const Pertanyaan = require('./pertanyaan')(sequelize);
const MappingLokasiPertanyaan = require('./MappingLokasiPertanyaan')(sequelize);
const Nilai = require('./nilai')(sequelize);

// Relasi
User.belongsTo(Lokasi, { foreignKey: 'lokasiId' });
Lokasi.hasMany(User, { foreignKey: 'lokasiId' });

Nilai.belongsTo(User, { foreignKey: 'userId' });
Nilai.belongsTo(Pertanyaan, { foreignKey: 'pertanyaanId' });

Pertanyaan.belongsTo(Kategori, { foreignKey: 'kategoriId' });
Kategori.hasMany(Pertanyaan, { foreignKey: 'kategoriId' });

Lokasi.belongsToMany(Pertanyaan, {
  through: MappingLokasiPertanyaan,
  foreignKey: 'lokasiId'
});
Pertanyaan.belongsToMany(Lokasi, {
  through: MappingLokasiPertanyaan,
  foreignKey: 'pertanyaanId'
});

MappingLokasiPertanyaan.belongsTo(Pertanyaan, { foreignKey: 'pertanyaanId' });
Pertanyaan.hasMany(MappingLokasiPertanyaan, { foreignKey: 'pertanyaanId' });

MappingLokasiPertanyaan.belongsTo(Lokasi, { foreignKey: 'lokasiId' });
Lokasi.hasMany(MappingLokasiPertanyaan, { foreignKey: 'lokasiId' });

module.exports = {
  sequelize,
  User,
  Lokasi,
  Kategori,
  Pertanyaan,
  MappingLokasiPertanyaan,
  Nilai
};
