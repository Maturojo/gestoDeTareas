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
