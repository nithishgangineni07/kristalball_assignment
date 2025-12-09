const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    baseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
    equipmentType: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Purchase', PurchaseSchema);
