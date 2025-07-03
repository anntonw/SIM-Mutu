// models/MappingLokasiPertanyaan.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('MappingLokasiPertanyaans', {
    lokasiId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pertanyaanId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'MappingLokasiPertanyaans',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['lokasiId', 'pertanyaanId'] // Biar unik, tidak dobel mapping
      }
    ]
  });
};
