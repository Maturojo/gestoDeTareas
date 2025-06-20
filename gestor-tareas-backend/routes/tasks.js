    const express = require('express');
    const router = express.Router();
    const Task = require('../models/Task');
    const verificarToken = require('../middlewares/verificarToken');

    // Obtener tareas del usuario logueado
    router.get('/', verificarToken, async (req, res) => {
    try {
        const usuario = req.usuario.nombre; // viene del token
        const tareas = await Task.find({ owner: usuario });
        res.json(tareas);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al obtener las tareas' });
    }
    });

    // Crear nueva tarea (usando el owner del token)
    router.post('/', verificarToken, async (req, res) => {
    try {
        const nuevaTarea = new Task({
        ...req.body,
        owner: req.usuario.nombre,
        completed: false
        });
        const tareaGuardada = await nuevaTarea.save();
        res.status(201).json(tareaGuardada);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al crear la tarea' });
    }
    });

    // Actualizar tarea
    router.put('/:id', verificarToken, async (req, res) => {
    try {
        const tarea = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(tarea);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al actualizar la tarea' });
    }
    });

    // Eliminar tarea
    router.delete('/:id', verificarToken, async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Tarea eliminada' });
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al eliminar la tarea' });
    }
    });

    module.exports = router;
