// models/Kategori.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Kategori', {
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    tableName: 'Kategori',
    timestamps: true
  });
};
