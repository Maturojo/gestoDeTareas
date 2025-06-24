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
app.use('/api/auth', require('./routes/auth'));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Fallback solo para rutas sin extensión (SPA)
app.get('*', (req, res, next) => {
    if (req.path.includes('.') || req.path.startsWith('/api/')) return next(); // si es archivo o ruta API, continuar
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});
