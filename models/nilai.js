// models/Nilai.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Nilai', {
    tanggal: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    kategoriId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pertanyaanId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    numerator: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    denumerator: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lokasiId: { type: DataTypes.INTEGER, allowNull: false }
  });
};
