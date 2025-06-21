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

// 👉 Servir archivos estáticos desde frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Conexión a MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('🟢 Conectado a MongoDB'))
    .catch(err => console.error('🔴 Error conectando a MongoDB:', err));

// Rutas API
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/observaciones', require('./routes/observaciones'));
app.use('/auth', require('./routes/auth.routes'));

// ✅ Fallback SOLO si la ruta no es API ni /auth
const loginPath = path.join(__dirname, '../frontend/pages/login.html');
app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/auth')) {
        res.sendFile(loginPath);
    } else {
        next();
    }
});

// Inicio del servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});
