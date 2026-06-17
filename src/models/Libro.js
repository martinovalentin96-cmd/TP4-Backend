const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Libro', {
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    precio: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    fechaPublicacion: {
      type: DataTypes.DATE,
      allowNull: true
    },
    portada: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });
};
