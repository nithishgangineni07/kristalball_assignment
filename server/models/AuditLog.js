const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    action: { type: String, required: true }, // e.g., 'CREATE_PURCHASE', 'LOGIN'
    collectionName: { type: String },
    documentId: { type: mongoose.Schema.Types.ObjectId },
    details: { type: Object },
    performedBy: { type: String }, // User ID or Email
    ipAddress: { type: String }
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
