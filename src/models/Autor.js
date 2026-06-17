const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Autor', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });
};
