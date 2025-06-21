const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

// 👉 Ruta de prueba para chequear si funciona
router.get('/', (req, res) => {
    res.send('Auth funcionando ✅');
});

// POST /auth/login
router.post('/login', async (req, res) => {
    const { usuario, password } = req.body;

    try {
        const user = await Usuario.findOne({ usuario });
        if (!user) return res.status(401).json({ mensaje: 'Usuario no encontrado' });

        const passwordOk = await bcrypt.compare(password, user.passwordHash);
        if (!passwordOk) return res.status(401).json({ mensaje: 'Contraseña incorrecta' });

        const token = jwt.sign(
            { id: user._id, nombre: user.nombre, puesto: user.puesto },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: true, // ⚠️ poner false si estás en localhost
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ success: true, nombre: user.nombre });
    } catch (err) {
        console.error('❌ Error en login:', err);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
});

module.exports = router;
