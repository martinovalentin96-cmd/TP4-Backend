const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Editorial } = require('../models');

router.get('/', async (req, res) => {
  const editoriales = await Editorial.findAll();
  res.json(editoriales);
});

router.post('/', [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio')
], async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errors: errores.array() });

  const editorial = await Editorial.create({ nombre: req.body.nombre, pais: req.body.pais });
  res.status(201).json(editorial);
});

router.put('/:id', [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio')
], async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errors: errores.array() });

  const editorial = await Editorial.findByPk(req.params.id);
  if (!editorial) return res.status(404).json({ error: 'Editorial no encontrada' });

  await editorial.update({ nombre: req.body.nombre, pais: req.body.pais });
  res.json(editorial);
});

router.delete('/:id', async (req, res) => {
  const editorial = await Editorial.findByPk(req.params.id);
  if (!editorial) return res.status(404).json({ error: 'Editorial no encontrada' });

  await editorial.destroy();
  res.status(204).send();
});

module.exports = router;
