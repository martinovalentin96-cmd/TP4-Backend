const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Editorial', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
};