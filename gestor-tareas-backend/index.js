const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const { MONGO_URI, PORT } = require('./config');
const Usuario = require('./models/Usuario');

const app = express();

// Middlewares
app.use(cors({
    origin: 'https://gestodetareas-1.onrender.com',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Conexión a MongoDB y creación de usuarios iniciales
mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('🟢 Conectado a MongoDB');

        const yaHayUsuarios = await Usuario.countDocuments();
        if (yaHayUsuarios === 0) {
            console.log('⚙️ Creando usuarios iniciales...');
            const empleados = [
                { usuario: 'matias', password: '1234', nombre: 'Matías', puesto: 'Whatsapp' },
                { usuario: 'facundo', password: '1234', nombre: 'Facundo', puesto: 'Taller' },
                { usuario: 'ariel',   password: '1234', nombre: 'Ariel',   puesto: 'Producción' },
                { usuario: 'guillermo', password: '1234', nombre: 'Guillermo', puesto: 'Delivery' }
            ];

            for (const emp of empleados) {
                const hash = await bcrypt.hash(emp.password, 10);
                await new Usuario({
                    usuario: emp.usuario,
                    passwordHash: hash,
                    nombre: emp.nombre,
                    puesto: emp.puesto
                }).save();
                console.log(`✅ Usuario "${emp.usuario}" creado`);
            }
        } else {
            console.log('👤 Usuarios ya existen, no se crean duplicados.');
        }
    })
    .catch(err => console.error('🔴 Error conectando a MongoDB:', err));

// Rutas
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/observaciones', require('./routes/observaciones'));
app.use('/auth', require('./routes/auth.routes')); // login

// Inicio del servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});
