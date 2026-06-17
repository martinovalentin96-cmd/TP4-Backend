const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('ItemPedido', {
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    precioUnitario: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  });
};
