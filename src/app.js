const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/libros',      require('./routes/libros'));
app.use('/api/autores',     require('./routes/autores'));
app.use('/api/generos',     require('./routes/generos'));
app.use('/api/editoriales', require('./routes/editoriales'));
app.use('/api/usuarios',    require('./routes/usuarios'));
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/pedidos',     require('./routes/pedidos'));
app.use('/api/resena',     require('./routes/resena'));


if (require.main === module) {
  const { sequelize } = require('./models');
  sequelize.sync().then(() => {
    app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));
  });
}

module.exports = app;
