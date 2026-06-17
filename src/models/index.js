const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

const Genero     = require('./Genero')(sequelize);
const Editorial  = require('./Editorial')(sequelize);
const Autor      = require('./Autor')(sequelize);
const Libro      = require('./Libro')(sequelize);
const Usuario    = require('./Usuario')(sequelize);
const Pedido     = require('./Pedido')(sequelize);
const ItemPedido = require('./ItemPedido')(sequelize);
const Resena     = require('./Resena')(sequelize);

Libro.belongsTo(Autor,     { foreignKey: 'autorId' });
Libro.belongsTo(Genero,    { foreignKey: 'generoId' });
Libro.belongsTo(Editorial, { foreignKey: 'editorialId' });
Autor.hasMany(Libro,       { foreignKey: 'autorId' });
Genero.hasMany(Libro,      { foreignKey: 'generoId' });
Editorial.hasMany(Libro,   { foreignKey: 'editorialId' });

Pedido.belongsTo(Usuario,  { foreignKey: 'usuarioId' });
Usuario.hasMany(Pedido,    { foreignKey: 'usuarioId' });

ItemPedido.belongsTo(Pedido, { foreignKey: 'pedidoId' });
ItemPedido.belongsTo(Libro,  { foreignKey: 'libroId' });
Pedido.hasMany(ItemPedido,   { foreignKey: 'pedidoId' });
Libro.hasMany(ItemPedido,    { foreignKey: 'libroId' });

Resena.belongsTo(Usuario,  { foreignKey: 'usuarioId' });
Resena.belongsTo(Libro,    { foreignKey: 'libroId' });
Usuario.hasMany(Resena,    { foreignKey: 'usuarioId' });
Libro.hasMany(Resena,      { foreignKey: 'libroId' });

module.exports = { sequelize, Genero, Editorial, Autor, Libro, Usuario, Pedido, ItemPedido, Resena };