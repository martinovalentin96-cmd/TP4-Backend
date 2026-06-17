const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('DetallePedido', {
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
