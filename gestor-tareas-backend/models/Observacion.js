    const mongoose = require('mongoose');

    const observacionSchema = new mongoose.Schema({
    employee: { type: String, required: true, unique: true },
    text: { type: String, default: '' }
    });

    module.exports = mongoose.model('Observacion', observacionSchema);
