const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Pedido, ItemPedido, Libro } = require('../models');
const { verificarToken } = require('../middleware/auth');

router.get('/', verificarToken, async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      where: { usuarioId: req.usuario.id },
      include: [{
        model: ItemPedido,
        include: [Libro]
      }]
    });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', verificarToken, async (req, res) => {
  try {
    const pedido = await Pedido.findOne({
      where: { id: req.params.id, usuarioId: req.usuario.id },
      include: [{
        model: ItemPedido,
        include: [Libro]
      }]
    });
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', verificarToken, [
  body('items').isArray({ min: 1 }).withMessage('El pedido debe tener al menos un item'),
  body('items.*.libroId').notEmpty().withMessage('Cada item debe tener un libroId'),
  body('items.*.cantidad').isInt({ min: 1 }).withMessage('La cantidad debe ser mayor a 0')
], async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errors: errores.array() });

  try {
    let total = 0;
    const itemsConPrecio = [];

    for (const item of req.body.items) {
      const libro = await Libro.findByPk(item.libroId);
      if (!libro) return res.status(404).json({ error: `Libro ${item.libroId} no encontrado` });

      total += libro.precio * item.cantidad;
      itemsConPrecio.push({
        libroId: item.libroId,
        cantidad: item.cantidad,
        precioUnitario: libro.precio
      });
    }

    const pedido = await Pedido.create({
      total,
      usuarioId: req.usuario.id
    });

    for (const item of itemsConPrecio) {
      await ItemPedido.create({ ...item, pedidoId: pedido.id });
    }

    res.status(201).json(pedido);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', verificarToken, [
  body('estado').notEmpty().withMessage('El estado es obligatorio')
], async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errors: errores.array() });

  try {
    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });

    await pedido.update({ estado: req.body.estado });
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
