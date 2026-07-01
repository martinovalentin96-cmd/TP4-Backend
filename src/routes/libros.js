const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { Libro, Autor, Genero, Editorial, Resena, Usuario } = require('../models');
const { verificarToken, soloAdmin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const where = {};
    const includeAutor = { model: Autor };

    if (req.query.titulo) {
      where.titulo = { [Op.like]: `%${req.query.titulo}%` };
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const libro = await Libro.findByPk(req.params.id, {
      include: [Autor, Genero, Editorial, { model: Resena, include: [Usuario] }]
    });
    if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });
    res.json(libro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', verificarToken, soloAdmin, [
  body('titulo').notEmpty().withMessage('El título es obligatorio'),
  body('precio').isFloat({ min: 0.01 }).withMessage('El precio debe ser un número positivo'),
  body('stock').isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo'),
  body('autorId').notEmpty().withMessage('El autor es obligatorio'),
  body('generoId').notEmpty().withMessage('El género es obligatorio'),
  body('editorialId').notEmpty().withMessage('La editorial es obligatoria')
], async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errors: errores.array() });

  try {
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
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', verificarToken, soloAdmin, [
  body('titulo').notEmpty().withMessage('El título es obligatorio'),
  body('precio').isFloat({ min: 0.01 }).withMessage('El precio debe ser un número positivo'),
  body('stock').isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo')
], async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errors: errores.array() });

  try {
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', verificarToken, soloAdmin, async (req, res) => {
  try {
    const libro = await Libro.findByPk(req.params.id);
    if (!libro) return res.status(404).json({ error: 'Libro no encontrado' });

    await libro.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
