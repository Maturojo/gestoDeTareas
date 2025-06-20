    const express = require('express');
    const cors = require('cors');
    const bodyParser = require('body-parser');
    const app = express();
    const PORT = process.env.PORT || 3000;

    app.use(cors());
    app.use(bodyParser.json());

    // Ejemplo de tareas en memoria (más adelante usarás una DB)
    let tasks = [];

    app.get('/tasks', (req, res) => res.json(tasks));
    app.post('/tasks', (req, res) => {
    const newTask = req.body;
    tasks.push(newTask);
    res.status(201).json(newTask);
    });

    app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
