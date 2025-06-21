// 📁 gestor-tareas-backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const { MONGO_URI, PORT } = require('./config');

const app = express();

// Middlewares
app.use(cors({
    origin: 'https://gestodetareas-1.onrender.com', // Cambiar si tu frontend tiene otra URL
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// 👉 Servir archivos estáticos desde la carpeta frontend
app.use(express.static(path.resolve(__dirname, '../frontend')));

// Conexión a MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('🟢 Conectado a MongoDB'))
    .catch(err => console.error('🔴 Error conectando a MongoDB:', err));

// Rutas API
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/observaciones', require('./routes/observaciones'));
app.use('/auth', require('./routes/auth.routes'));

// Ruta fallback: sirve login.html si no encuentra otra
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/pages/login.html'));
});

// Inicio del servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});
