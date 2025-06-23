    // 📁 gestor-tareas-backend/routes/auth.js
    const express = require('express');
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');
    const Usuario = require('../models/Usuario');

    const router = express.Router();
    const JWT_SECRET = process.env.JWT_SECRET || 'secreto123';

    // Login
    router.post('/login', async (req, res) => {
    const { usuario, password } = req.body;

    try {
        const user = await Usuario.findOne({ usuario });
        if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

        const token = jwt.sign({ id: user._id, usuario: user.usuario }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, nombre: user.nombre, puesto: user.puesto });
    } catch (err) {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
    });

    // Registro (opcional)
    router.post('/register', async (req, res) => {
    const { nombre, usuario, password, puesto } = req.body;

    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new Usuario({ nombre, usuario, passwordHash, puesto });
        await newUser.save();
        res.status(201).json({ message: 'Usuario creado' });
    } catch (err) {
        res.status(400).json({ error: 'Error al registrar usuario' });
    }
    });

    module.exports = router;
