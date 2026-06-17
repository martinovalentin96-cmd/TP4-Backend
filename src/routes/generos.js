const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Genero } = require('../models');

router.get('/', async (req, res) => {
  const generos = await Genero.findAll();
  res.json(generos);
});

router.post('/', [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio')
], async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errors: errores.array() });

  const genero = await Genero.create({ nombre: req.body.nombre });
  res.status(201).json(genero);
});

router.put('/:id', [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio')
], async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errors: errores.array() });

  const genero = await Genero.findByPk(req.params.id);
  if (!genero) return res.status(404).json({ error: 'Género no encontrado' });

  await genero.update({ nombre: req.body.nombre });
  res.json(genero);
});

router.delete('/:id', async (req, res) => {
  const genero = await Genero.findByPk(req.params.id);
  if (!genero) return res.status(404).json({ error: 'Género no encontrado' });

  await genero.destroy();
  res.status(204).send();
});

module.exports = router;
