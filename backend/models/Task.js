    const mongoose = require('mongoose');

    const taskSchema = new mongoose.Schema({
    title: String,
    desc: String,
    owner: String,
    priority: Number,
    dueDate: String,
    completed: {
        type: Boolean,
        default: false
    },
    observacion: String
    });

    module.exports = mongoose.model('Task', taskSchema);
