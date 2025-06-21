    // 📁 gestor-tareas-backend/models/Usuario.js
    const mongoose = require('mongoose');

    const UsuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    usuario: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    puesto: { type: String, required: true }
    });

    module.exports = mongoose.model('Usuario', UsuarioSchema);
