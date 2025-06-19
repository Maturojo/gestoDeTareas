const express = require('express');
const router = express.Router();
const Observacion = require('../models/Observacion');

    // Obtener una observación por empleado
    router.get('/:employee', async (req, res) => {
    try {
        const obs = await Observacion.findOne({ employee: req.params.employee });
        res.json(obs || { employee: req.params.employee, text: '' });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener observación' });
    }
    });

    // Crear o actualizar observación
    router.post('/:employee', async (req, res) => {
    try {
        const { text } = req.body;
        const updated = await Observacion.findOneAndUpdate(
        { employee: req.params.employee },
        { text },
        { new: true, upsert: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Error al guardar observación' });
    }
    });

    module.exports = router;
