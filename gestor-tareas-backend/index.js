const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const { MONGO_URI, PORT } = require('./config');

const app = express();

// Middlewares
app.use(cors({
    origin: 'https://gestodetareas-1.onrender.com', // ⚠️ Asegurate que esta URL sea la de tu frontend
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// ✅ Servir carpeta principal del frontend (por si tenés assets ahí)
app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ Servir /pages explícitamente
app.use('/pages', express.static(path.join(__dirname, '../frontend/pages')));

// Conexión a MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('🟢 Conectado a MongoDB'))
    .catch(err => console.error('🔴 Error conectando a MongoDB:', err));

// Rutas API
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/observaciones', require('./routes/observaciones'));
app.use('/auth', require('./routes/auth.routes'));

// Ruta fallback 404
app.get('*', (req, res) => {
    res.status(404).send('Página no encontrada');
});

// Inicio del servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});
