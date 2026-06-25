const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const { SECRET } = require('../middleware/auth');

router.post('/register', [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('email').isEmail().withMessage('El email no es válido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errors: errores.array() });

  try {
    const passwordEncriptada = await bcrypt.hash(req.body.password, 10);
    const usuario = await Usuario.create({
      nombre: req.body.nombre,
      email: req.body.email,
      password: passwordEncriptada
    });

    const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, SECRET);
    res.status(201).json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', [
  body('email').isEmail().withMessage('El email no es válido'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria')
], async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errors: errores.array() });

  try {
    const usuario = await Usuario.findOne({ where: { email: req.body.email } });
    if (!usuario) return res.status(401).json({ error: 'Email o contraseña incorrectos' });

    const passwordValida = await bcrypt.compare(req.body.password, usuario.password);
    if (!passwordValida) return res.status(401).json({ error: 'Email o contraseña incorrectos' });

    const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, SECRET);
    res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
