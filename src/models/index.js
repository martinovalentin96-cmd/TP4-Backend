const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

const Genero    = require('./Genero')(sequelize);
const Editorial = require('./Editorial')(sequelize);
const Autor     = require('./Autor')(sequelize);
const Libro     = require('./Libro')(sequelize);
const Usuario   = require('./Usuario')(sequelize);
const Pedido    = require('./Pedido')(sequelize);
const DetallePedido = require('./DetallePedido')(sequelize);
const Resena    = require('./Resena')(sequelize);

// Asociaciones (las definimos en el Paso 5)

module.exports = { sequelize, Genero, Editorial, Autor, Libro, Usuario, Pedido, DetallePedido, Resena };