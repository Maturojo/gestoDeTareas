const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { MONGO_URI, PORT } = require('./config');

const app = express();

// Middlewares
app.use(cors({
    origin: 'https://gestodetareas-1.onrender.com', // cambiá si usás otro puerto o dominio
    credentials: true               // 👈 permite que las cookies viajen
}));
app.use(express.json());
app.use(cookieParser());

// Conexión a MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('🟢 Conectado a MongoDB'))
    .catch(err => console.error('🔴 Error conectando a MongoDB:', err));

// Rutas
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/observaciones', require('./routes/observaciones'));
app.use('/auth', require('./routes/auth.routes')); // 👈 nueva ruta de login

// Inicio del servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});
