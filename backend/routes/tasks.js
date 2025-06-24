// 📁 backend/routes/tasks.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Obtener todas las tareas
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener tareas' });
    }
});

// Crear tarea
router.post('/', async (req, res) => {
    const { title, desc, owner, priority, dueDate, completed } = req.body;

    try {
        const newTask = new Task({ title, desc, owner, priority, dueDate, completed });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ error: 'Error al crear tarea' });
    }
});

// Actualizar tarea
router.put('/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ error: 'Error al actualizar tarea' });
    }
});

// Eliminar tarea
router.delete('/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.status(204).end();
    } catch (err) {
        res.status(400).json({ error: 'Error al eliminar tarea' });
    }
});

module.exports = router;
