const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const { MONGO_URI, PORT } = require('./config');

const app = express();

// Middlewares
app.use(cors({
    origin: 'https://gestodetareas-1.onrender.com',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Servir frontend
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/pages', express.static(path.join(__dirname, '../frontend/pages')));

// Rutas API (verificá estos requires estén bien)
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/observaciones', require('./routes/observaciones'));
app.use('/auth', require('./routes/auth.routes')); // asegurate que este archivo exista

// Fallback 404
app.get('*', (req, res) => {
    res.status(404).send('Página no encontrada');
});

// DB + inicio
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Conectado a MongoDB');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
        });
    })
    .catch(err => console.error('❌ Error conectando a MongoDB:', err));
