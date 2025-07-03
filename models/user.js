// models/User.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Users', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      defaultValue: 'user'
    },
    lokasiId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'Users',
    timestamps: true
  });
};
