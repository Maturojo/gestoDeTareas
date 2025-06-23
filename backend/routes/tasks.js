const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const verificarToken = require('../middleware/verificarToken');

// Obtener todas las tareas
router.get('/', verificarToken, async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener tareas' });
    }
});

// Crear una tarea
router.post('/', verificarToken, async (req, res) => {
    const { title, completed } = req.body;

    try {
        const newTask = new Task({ title, completed });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ error: 'Error al crear tarea' });
    }
});

// Actualizar una tarea
router.put('/:id', verificarToken, async (req, res) => {
    const { title, completed } = req.body;

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { title, completed },
            { new: true }
        );
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ error: 'Error al actualizar tarea' });
    }
});

// Eliminar una tarea
router.delete('/:id', verificarToken, async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.status(204).end();
    } catch (err) {
        res.status(400).json({ error: 'Error al eliminar tarea' });
    }
});

module.exports = router;
