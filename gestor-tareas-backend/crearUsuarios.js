    // gestor-tareas-backend/crearUsuarios.js
    const mongoose = require('mongoose');
    const dotenv = require('dotenv');
    const bcrypt = require('bcryptjs');
    const Usuario = require('./models/Usuario');

    dotenv.config();

    async function crearUsuarios() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    const empleados = [
        { usuario: 'matias', password: '1234', nombre: 'Matías', puesto: 'Whatsapp' },
        { usuario: 'facundo', password: '1234', nombre: 'Facundo', puesto: 'Taller' },
        { usuario: 'ariel',   password: '1234', nombre: 'Ariel',   puesto: 'Producción' },
        { usuario: 'guillermo', password: '1234', nombre: 'Guillermo', puesto: 'Delivery' }
    ];

    for (const emp of empleados) {
        const yaExiste = await Usuario.findOne({ usuario: emp.usuario });
        if (yaExiste) {
        console.log(`⏭ Usuario "${emp.usuario}" ya existe. Skipping...`);
        continue;
        }

        const hash = await bcrypt.hash(emp.password, 10);
        const nuevo = new Usuario({
        usuario: emp.usuario,
        passwordHash: hash,
        nombre: emp.nombre,
        puesto: emp.puesto
        });

        await nuevo.save();
        console.log(`✅ Usuario "${emp.usuario}" creado`);
    }

    mongoose.disconnect();
    }

    crearUsuarios();
