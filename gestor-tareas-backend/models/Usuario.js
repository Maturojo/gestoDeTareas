    // 📁 backend/models/Usuario.js
    import mongoose from 'mongoose';

    const UsuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    usuario: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    puesto: { type: String, required: true }
    });

    export default mongoose.model('Usuario', UsuarioSchema);
