// models/Pertanyaan.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Pertanyaans', {
    judul: {
      type: DataTypes.STRING,
      allowNull: false
    },
    numerator: {
      type: DataTypes.STRING,
      allowNull: false
    },
    denumerator: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pedomanPath: {
      type: DataTypes.STRING,
      allowNull: true
    },
    formManualPath: {
      type: DataTypes.STRING,
      allowNull: true
    },
    kategoriId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Pertanyaans',
    timestamps: true
  });
};
