// 📁 gestor-tareas-backend/middleware/verificarToken.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secreto123';

function verificarToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.usuario = decoded; // el payload del token
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido' });
    }
}

module.exports = verificarToken;
