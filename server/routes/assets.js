const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset');
const Purchase = require('../models/Purchase');
const Transfer = require('../models/Transfer');
const Expenditure = require('../models/Expenditure');
const Assignment = require('../models/Assignment');
const auth = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

// @route   GET api/assets/dashboard
// @desc    Get aggregated dashboard data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
    try {
        const { baseId, equipmentType, startDate, endDate } = req.query;

        const matchStage = {};
        if (baseId) matchStage.baseId = new mongoose.Types.ObjectId(baseId);
        if (req.user.role === 'commander' && req.user.baseId) {
            matchStage.baseId = new mongoose.Types.ObjectId(req.user.baseId);
        }
        if (equipmentType) matchStage.equipmentType = equipmentType;

        // We need a list of all unique equipment types + bases to pivot on.
        // However, aggregation is cleaner if we do it per collection and merge.

        // 1. Get Opening Balances (Static Initial)
        // In a real advanced system, "Opening Balance" for a date range depends on previous movements.
        // For simplicity given specifications: 
        // "Opening Balance" = Asset.openingBalance (System Start)
        // "Closing Balance" = Opening + Purchases + TransfersIn - TransfersOut - Expenditures
        // "Net Movement" = Purchases + Transfers In - Transfers Out

        // Let's compute everything for the TARGET BASE(S).

        const assets = await Asset.find(baseId ? { baseId } : {});
        // If filtering by baseId, we only care about that base's assets.

        // We will build a report object: { [baseId_equipType]: { opening, purchased, transferredIn, transferredOut, expended, assigned, closing } }

        // Helper to aggregate based on match criteria
        const aggregateCollection = async (Model, matchQuery, groupField, sumField) => {
            return await Model.aggregate([
                { $match: matchQuery },
                { $group: { _id: groupField, total: { $sum: '$' + sumField } } }
            ]);
        };

        // Build Date Filter for movements
        let dateFilter = {};
        if (startDate || endDate) {
            dateFilter.date = {};
            if (startDate) dateFilter.date.$gte = new Date(startDate);
            if (endDate) dateFilter.date.$lte = new Date(endDate);
        }

        // Purchases
        const purchaseMatch = { ...dateFilter };
        if (matchStage.baseId) purchaseMatch.baseId = matchStage.baseId;
        if (matchStage.equipmentType) purchaseMatch.equipmentType = matchStage.equipmentType;

        const purchases = await aggregateCollection(Purchase, purchaseMatch, { baseId: '$baseId', type: '$equipmentType' }, 'quantity');

        // Transfers In
        const transferInMatch = { ...dateFilter };
        if (matchStage.baseId) transferInMatch.toBaseId = matchStage.baseId;
        if (matchStage.equipmentType) transferInMatch.equipmentType = matchStage.equipmentType;
        // Note: If no baseId is filtered, we sum ALL transfers? 
        // Careful: Net movement for ALL bases = 0 sum game for transfers? 
        // Yes, but the dashboard usually shows a specific context or a list of bases.
        // Let's group by ToBase.
        const transfersIn = await Transfer.aggregate([
            { $match: transferInMatch },
            { $group: { _id: { baseId: '$toBaseId', type: '$equipmentType' }, total: { $sum: '$quantity' } } }
        ]);

        // Transfers Out
        const transferOutMatch = { ...dateFilter };
        if (matchStage.baseId) transferOutMatch.fromBaseId = matchStage.baseId;
        if (matchStage.equipmentType) transferOutMatch.equipmentType = matchStage.equipmentType;
        const transfersOut = await Transfer.aggregate([
            { $match: transferOutMatch },
            { $group: { _id: { baseId: '$fromBaseId', type: '$equipmentType' }, total: { $sum: '$quantity' } } }
        ]);

        // Expenditures
        const expendMatch = { ...dateFilter };
        if (matchStage.baseId) expendMatch.baseId = matchStage.baseId;
        if (matchStage.equipmentType) expendMatch.equipmentType = matchStage.equipmentType;
        const expenditures = await aggregateCollection(Expenditure, expendMatch, { baseId: '$baseId', type: '$equipmentType' }, 'quantity');

        // Assignments (Active/Returned - usually we just track currently assigned or total assigned in period)
        const assignMatch = { ...dateFilter };
        if (matchStage.baseId) assignMatch.baseId = matchStage.baseId;
        if (matchStage.equipmentType) assignMatch.equipmentType = matchStage.equipmentType;
        const assignments = await aggregateCollection(Assignment, assignMatch, { baseId: '$baseId', type: '$equipmentType' }, 'quantity');


        // MAPPING RESULTS
        // We iterate over known Assets (which define Base+Type pairs) and attach calculated values.
        // If an asset was purchased but not in Asset init table, it might be missed if we strict loop Assets.
        // Better to build a map of all keys encountered.

        let report = {};
        const key = (b, t) => `${b}_${t}`;

        // Initialize with Assets (Audit baseline)
        const allAssets = await Asset.find(baseId ? { baseId } : {}).populate('baseId'); // If admin, get all.

        // Filter assets if user is commander
        const accessibleAssets = (req.user.role === 'commander' && req.user.baseId)
            ? allAssets.filter(a => a.baseId._id.toString() === req.user.baseId.toString())
            : allAssets;

        accessibleAssets.forEach(a => {
            if (equipmentType && a.equipmentType !== equipmentType) return;

            const k = key(a.baseId._id, a.equipmentType);
            report[k] = {
                baseName: a.baseId.name,
                equipmentType: a.equipmentType,
                openingBalance: a.openingBalance,
                purchases: 0,
                transfersIn: 0,
                transfersOut: 0,
                expended: 0,
                assigned: 0
            };
        });

        // Helper to merge agg results
        const merge = (list, field) => {
            list.forEach(item => {
                const k = key(item._id.baseId, item._id.type);
                // If this pair wasn't in "Assets", it implies a new asset type introduced via purchase/transfer
                // We should handle that case, but for now assuming Assets are pre-declared or we ignore.
                // Let's create entry if missing (should fetch Base name though, which is tricky in agg).
                // For now, only update existing keys.
                if (report[k]) {
                    report[k][field] = item.total;
                }
            });
        };

        merge(purchases, 'purchases');
        merge(transfersIn, 'transfersIn');
        merge(transfersOut, 'transfersOut');
        merge(expenditures, 'expended');
        merge(assignments, 'assigned');

        // Compute Net and Closing
        const data = Object.values(report).map(row => {
            const netMovement = row.purchases + row.transfersIn - row.transfersOut;
            // Closing Balance = Opening + Net - Expended
            // Note: Assignments are usually "in stock but assigned". 
            // If "Assigned" means "Removed from storage", then subtract.
            // Usually, Expended means Gone. Assigned means Checked Out.
            // We'll calculate "Available" = Closing - Assigned?
            // Prompt asks for: Opening, Closing, Net Mvt, Assigned, Expended.
            const closingBalance = row.openingBalance + netMovement - row.expended;

            return {
                ...row,
                netMovement,
                closingBalance
            };
        });

        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
