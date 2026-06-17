const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { Libro, Autor, Genero, Editorial } = require('../models');

router.get('/', async (req, res) => {
  const where = {};
  const includeAutor = { model: Autor, as: 'Autor' };

  if (req.query.titulo) {
    where.titulo = { [Op.like]: `%${req.query.titulo}%` };
  }
  if (req.query.genero) {
    where['$Genero.nombre$'] = { [Op.like]: `%${req.query.genero}%` };
  }
  if (req.query.autor) {
    includeAutor.where = { nombre: { [Op.like]: `%${req.query.autor}%` } };
    includeAutor.required = true;
  }

  const libros = await Libro.findAll({
    where,
    include: [
      includeAutor,
      { model: Genero },
      { model: Editorial }
    ]
  });
  res.json(libros);
});

router.get('/:id', async (req, res) => {
  const libro = await Libro.findByPk(req.params.id, {
    include: [Autor, Genero, Editorial]
  });
  if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });
  res.json(libro);
});

router.post('/', [
  body('titulo').notEmpty().withMessage('El título es obligatorio'),
  body('precio').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  body('stock').isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo'),
  body('autorId').notEmpty().withMessage('El autor es obligatorio'),
  body('generoId').notEmpty().withMessage('El género es obligatorio'),
  body('editorialId').notEmpty().withMessage('La editorial es obligatoria')
], async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errors: errores.array() });

  const libro = await Libro.create({
    titulo: req.body.titulo,
    precio: req.body.precio,
    stock: req.body.stock,
    fechaPublicacion: req.body.fechaPublicacion,
    portada: req.body.portada,
    autorId: req.body.autorId,
    generoId: req.body.generoId,
    editorialId: req.body.editorialId
  });
  res.status(201).json(libro);
});

router.put('/:id', [
  body('titulo').notEmpty().withMessage('El título es obligatorio'),
  body('precio').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  body('stock').isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo')
], async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errors: errores.array() });

  const libro = await Libro.findByPk(req.params.id);
  if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });

  await libro.update({
    titulo: req.body.titulo,
    precio: req.body.precio,
    stock: req.body.stock,
    fechaPublicacion: req.body.fechaPublicacion,
    portada: req.body.portada,
    autorId: req.body.autorId,
    generoId: req.body.generoId,
    editorialId: req.body.editorialId
  });
  res.json(libro);
});

router.delete('/:id', async (req, res) => {
  const libro = await Libro.findByPk(req.params.id);
  if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });

  await libro.destroy();
  res.status(204).send();
});

module.exports = router;