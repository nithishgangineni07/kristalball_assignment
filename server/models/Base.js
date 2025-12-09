const mongoose = require('mongoose');

const BaseSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    location: { type: String, required: true }
});

module.exports = mongoose.model('Base', BaseSchema);
