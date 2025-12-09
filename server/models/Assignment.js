const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    baseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
    equipmentType: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    assignedTo: { type: String, required: true }, // Personnel name/ID
    status: { type: String, enum: ['active', 'returned'], default: 'active' },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Assignment', AssignmentSchema);
