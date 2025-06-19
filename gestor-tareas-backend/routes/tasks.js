    const express = require('express');
    const router = express.Router();
    const Task = require('../models/Task');

    // GET: obtener todas las tareas
    router.get('/', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
    });

    // POST: crear nueva tarea
    router.post('/', async (req, res) => {
    const newTask = new Task(req.body);
    const saved = await newTask.save();
    res.status(201).json(saved);
    });

    module.exports = router;

    // PUT: actualizar tarea (ej. marcar como completada)
router.put('/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar la tarea' });
    }
});

// DELETE: eliminar tarea
router.delete('/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Tarea eliminada correctamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar la tarea' });
    }
});

