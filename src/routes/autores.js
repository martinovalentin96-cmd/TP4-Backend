const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Autor, Libro } = require('../models');

router.get('/', async (req, res) => {
  const autores = await Autor.findAll();
  res.json(autores);
});

router.get('/:id', async (req, res) => {
  const autor = await Autor.findByPk(req.params.id, { include: Libro });
  if (!autor) return res.status(404).json({ error: 'Autor no encontrado' });
  res.json(autor);
});

router.post('/', [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio')
], async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errors: errores.array() });

  const autor = await Autor.create({ nombre: req.body.nombre, bio: req.body.bio });
  res.status(201).json(autor);
});

router.put('/:id', [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio')
], async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errors: errores.array() });

  const autor = await Autor.findByPk(req.params.id);
  if (!autor) return res.status(404).json({ error: 'Autor no encontrado' });

  await autor.update({ nombre: req.body.nombre, bio: req.body.bio });
  res.json(autor);
});

router.delete('/:id', async (req, res) => {
  const autor = await Autor.findByPk(req.params.id);
  if (!autor) return res.status(404).json({ error: 'Autor no encontrado' });

  await autor.destroy();
  res.status(204).send();
});

module.exports = router;
