const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
    baseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
    equipmentType: { type: String, required: true },
    openingBalance: { type: Number, required: true, default: 0 }, // Initial system state
    // Current balance will be computed or cached here if needed. 
    // For strict Audit, we compute from Opening + Mvts. 
    // Requirement says "Use aggregation pipelines to compute opening/closing/net".
    // So this collection just defines the "starting point" (t=0).
});

// Composite index to ensure unique equipment type per base
AssetSchema.index({ baseId: 1, equipmentType: 1 }, { unique: true });

module.exports = mongoose.model('Asset', AssetSchema);
