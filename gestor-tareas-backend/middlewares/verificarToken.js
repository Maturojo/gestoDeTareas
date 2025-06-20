    const jwt = require('jsonwebtoken');

    function verificarToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ mensaje: 'Acceso denegado. No se encontró token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded; // Podés usar esto para saber quién es el usuario logueado
        next();
    } catch (err) {
        return res.status(401).json({ mensaje: 'Token inválido o expirado.' });
    }
    }

    module.exports = verificarToken;
