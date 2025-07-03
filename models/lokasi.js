// models/Lokasi.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Lokasis', {
    nama: {
      type: DataTypes.STRING,
      allowNull: false
    },
    alamat: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'Lokasis',
    timestamps: true
  });
};
