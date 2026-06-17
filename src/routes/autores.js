const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Autor, Libro } = require('../models');

router.get('/', async (req, res) => {
  try {
    const autores = await Autor.findAll();
    res.json(autores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const autor = await Autor.findByPk(req.params.id, { include: Libro });
    if (!autor) return res.status(404).json({ error: 'Autor no encontrado' });
    res.json(autor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio')
], async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errors: errores.array() });

  try {
    const autor = await Autor.create({ nombre: req.body.nombre, bio: req.body.bio });
    res.status(201).json(autor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio')
], async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errors: errores.array() });

  try {
    const autor = await Autor.findByPk(req.params.id);
    if (!autor) return res.status(404).json({ error: 'Autor no encontrado' });

    await autor.update({ nombre: req.body.nombre, bio: req.body.bio });
    res.json(autor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const autor = await Autor.findByPk(req.params.id);
    if (!autor) return res.status(404).json({ error: 'Autor no encontrado' });

    await autor.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
