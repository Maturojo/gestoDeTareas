const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const { MONGO_URI, PORT } = require('./config');

const app = express();

// Middlewares
app.use(cors({
    origin: 'https://gestodetareas.onrender.com', // Cambiar si usás otro dominio
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Servir el frontend
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/pages', express.static(path.join(__dirname, '../frontend/pages')));

// Rutas API
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/observaciones', require('./routes/observaciones'));
app.use('/auth', require('./routes/auth.routes')); // Asegurate de que el archivo exista y exporte router

// Ruta de prueba para Render
app.get('/ping', (req, res) => {
    res.send('pong');
});

// Fallback para rutas no encontradas
app.get('*', (req, res) => {
    res.status(404).send('Página no encontrada');
});

// Conexión a la base de datos y arranque del servidor
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Conectado a MongoDB');
        app.listen(PORT || 5000, () => {
            console.log(`🚀 Servidor corriendo en puerto ${PORT || 5000}`);
        });
    })
    .catch(err => console.error('❌ Error conectando a MongoDB:', err));
