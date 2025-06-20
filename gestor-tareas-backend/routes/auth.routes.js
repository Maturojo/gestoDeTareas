    import express from 'express';
    import bcrypt from 'bcryptjs';
    import jwt from 'jsonwebtoken';
    import Usuario from '../models/Usuario.js';
    import dotenv from 'dotenv';

    dotenv.config();

    const router = express.Router();

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
        secure: true, // ⚠️ Usar false si estás en localhost sin HTTPS
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ success: true, nombre: user.nombre });
    } catch (err) {
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
    });

    export default router;
