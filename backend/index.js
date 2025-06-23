const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { MONGO_URI, PORT } = require('./config');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('🟢 Conectado a MongoDB'))
    .catch(err => console.error('🔴 Error conectando a MongoDB:', err));

// Rutas API
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/observaciones', require('./routes/observaciones'));
app.use('/api/auth', require('./routes/auth')); // <-- Ruta de login/registro de usuarios
// Si luego agregás usuarios:
// app.use('/api/usuarios', require('./routes/usuarios'));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Fallback para rutas del frontend (Single Page App)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});
