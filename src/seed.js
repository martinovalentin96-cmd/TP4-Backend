const bcrypt = require('bcryptjs');
const { sequelize, Usuario, Genero, Editorial, Autor, Libro } = require('./models');

async function seed() {
  const cantUsuarios = await Usuario.count();
  if (cantUsuarios > 0) return;

  console.log('Base vacía — cargando datos iniciales...');

  const generos = await Genero.bulkCreate([
    { nombre: 'Ficción' },
    { nombre: 'Terror' },
    { nombre: 'Romance' },
    { nombre: 'Historia' },
    { nombre: 'Fantasía' },
    { nombre: 'Ciencia Ficción' },
  ]);

  const editoriales = await Editorial.bulkCreate([
    { nombre: 'Editorial Sur', pais: 'Argentina' },
    { nombre: 'Secker & Warburg', pais: 'Reino Unido' },
    { nombre: 'Chilton Books', pais: 'Estados Unidos' },
    { nombre: 'Sudamericana', pais: 'Argentina' },
  ]);

  const autores = await Autor.bulkCreate([
    { nombre: 'Jorge Luis Borges', bio: 'Escritor argentino, autor de Ficciones y El Aleph.' },
    { nombre: 'George Orwell', bio: 'Escritor británico, autor de 1984 y Rebelión en la granja.' },
    { nombre: 'Frank Herbert', bio: 'Escritor estadounidense, autor de la saga Dune.' },
    { nombre: 'Julio Cortázar', bio: 'Escritor argentino, autor de Rayuela y Bestiario.' },
  ]);

  await Libro.bulkCreate([
    {
      titulo: 'El Aleph',
      precio: 4500,
      stock: 12,
      fechaPublicacion: '1949-01-01',
      portada: 'https://covers.openlibrary.org/b/id/8231983-L.jpg',
      autorId: autores[0].id,
      generoId: generos[0].id,
      editorialId: editoriales[0].id,
    },
    {
      titulo: '1984',
      precio: 3800,
      stock: 8,
      fechaPublicacion: '1949-06-08',
      portada: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
      autorId: autores[1].id,
      generoId: generos[5].id,
      editorialId: editoriales[1].id,
    },
    {
      titulo: 'Dune',
      precio: 5200,
      stock: 5,
      fechaPublicacion: '1965-08-01',
      portada: 'https://covers.openlibrary.org/b/id/8701274-L.jpg',
      autorId: autores[2].id,
      generoId: generos[4].id,
      editorialId: editoriales[2].id,
    },
    {
      titulo: 'Rayuela',
      precio: 4100,
      stock: 15,
      fechaPublicacion: '1963-06-28',
      portada: 'https://covers.openlibrary.org/b/id/8226198-L.jpg',
      autorId: autores[3].id,
      generoId: generos[0].id,
      editorialId: editoriales[3].id,
    },
    {
      titulo: 'Ficciones',
      precio: 3900,
      stock: 10,
      fechaPublicacion: '1944-01-01',
      portada: 'https://covers.openlibrary.org/b/id/8228691-L.jpg',
      autorId: autores[0].id,
      generoId: generos[0].id,
      editorialId: editoriales[0].id,
    },
  ]);

  const passwordAdmin = await bcrypt.hash('admin123', 10);
  await Usuario.create({
    nombre: 'Administrador',
    email: 'admin@svmbooks.com',
    password: passwordAdmin,
    rol: 'admin',
  });

  console.log('Datos cargados correctamente.');
  console.log('Admin: admin@svmbooks.com / admin123');
}

module.exports = seed;
