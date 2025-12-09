const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['admin', 'commander', 'logistics'],
        required: true
    },
    baseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Base' }, // Null for admin/logistics if they are global? Req says Commander -> their base. Logistics -> purchases/transfers.
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
