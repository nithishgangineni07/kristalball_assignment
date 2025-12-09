const mongoose = require('mongoose');

const TransferSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    fromBaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
    toBaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
    equipmentType: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'completed' }, // Default completed for simplicity unless approval needed
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Transfer', TransferSchema);
