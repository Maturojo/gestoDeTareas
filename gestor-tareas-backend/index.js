const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const { MONGO_URI, PORT } = require('./config');

const app = express();

// Middlewares
app.use(cors({
    origin: 'https://gestodetareas.onrender.com', // Asegurate que coincida con tu frontend
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Servir frontend (si lo necesitás desde el backend)
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/pages', express.static(path.join(__dirname, '../frontend/pages')));

// Rutas API
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/observaciones', require('./routes/observaciones'));
app.use('/auth', require('./routes/auth.routes')); // Este archivo debe existir

// Ruta de prueba (opcional, para verificar funcionamiento)
app.get('/ping', (req, res) => {
    res.send('Servidor activo ✅');
});

// Fallback 404
app.get('*', (req, res) => {
    res.status(404).send('Página no encontrada');
});

// Conexión a la base de datos y arranque del servidor
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Conectado a MongoDB');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
        });
    })
    .catch(err => console.error('❌ Error conectando a MongoDB:', err));
