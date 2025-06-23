const express = require('express');
const router = express.Router();
const Observacion = require('../models/Observacion');
const verificarToken = require('../middleware/verificarToken');

// Obtener observaciones por empleado
router.get('/:employee', verificarToken, async (req, res) => {
    try {
        const observaciones = await Observacion.find({ employee: req.params.employee });
        res.json(observaciones);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener observaciones' });
    }
});

// Crear una observación
router.post('/:employee', verificarToken, async (req, res) => {
    const { texto } = req.body;

    try {
        const nueva = new Observacion({ employee: req.params.employee, texto });
        await nueva.save();
        res.status(201).json(nueva);
    } catch (err) {
        res.status(400).json({ error: 'Error al guardar observación' });
    }
});

module.exports = router;
