const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Resena, Usuario } = require('../models');
const { verificarToken } = require('../middleware/auth');

router.get('/libro/:id', async (req, res) => {
  try {
    const resenas = await Resena.findAll({
      where: { libroId: req.params.id },
      include: [{ model: Usuario, attributes: ['nombre'] }]
    });
    res.json(resenas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', verificarToken, [
  body('libroId').notEmpty().withMessage('El libroId es obligatorio'),
  body('puntaje').isInt({ min: 1, max: 5 }).withMessage('El puntaje debe ser entre 1 y 5'),
  body('comentario').optional()
], async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errors: errores.array() });

  try {
    const resena = await Resena.create({
      libroId: req.body.libroId,
      puntaje: req.body.puntaje,
      comentario: req.body.comentario,
      usuarioId: req.usuario.id
    });
    res.status(201).json(resena);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', verificarToken, [
  body('puntaje').isInt({ min: 1, max: 5 }).withMessage('El puntaje debe ser entre 1 y 5')
], async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errors: errores.array() });

  try {
    const resena = await Resena.findOne({
      where: { id: req.params.id, usuarioId: req.usuario.id }
    });
    if (!resena) return res.status(404).json({ error: 'Reseña no encontrada' });

    await resena.update({
      puntaje: req.body.puntaje,
      comentario: req.body.comentario
    });
    res.json(resena);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', verificarToken, async (req, res) => {
  try {
    const resena = await Resena.findOne({
      where: { id: req.params.id, usuarioId: req.usuario.id }
    });
    if (!resena) return res.status(404).json({ error: 'Reseña no encontrada' });

    await resena.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
