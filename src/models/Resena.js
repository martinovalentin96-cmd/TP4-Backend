const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Resena', {
    puntaje: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });
};
