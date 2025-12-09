const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');
const Asset = require('../models/Asset');
const AuditLog = require('../models/AuditLog');
const auth = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');

// @route   POST api/purchases
// @desc    Record new purchase
// @access  Logistics/Admin
router.post('/', [auth, verifyRole(['logistics', 'admin'])], async (req, res) => {
    const { baseId, equipmentType, quantity, date } = req.body;

    try {
        const purchase = new Purchase({
            baseId,
            equipmentType,
            quantity,
            date: date || Date.now(),
            recordedBy: req.user.id
        });

        await purchase.save();

        // Audit Log
        await new AuditLog({
            action: 'CREATE_PURCHASE',
            collectionName: 'purchases',
            documentId: purchase._id,
            details: purchase.toObject(),
            performedBy: req.user.id
        }).save();

        res.json(purchase);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/purchases
// @desc    Get all purchases (with filters)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const { baseId, equipmentType, startDate, endDate } = req.query;
        let query = {};

        // Role restrictions
        if (req.user.role === 'commander') {
            // Commanders can only see their base? Req doesn't explicitly restrict view, but implies "data tied to their base"
            if (req.user.baseId) {
                query.baseId = req.user.baseId;
            }
        }
        // If Admin/Logistics want to filter by base
        if (baseId) query.baseId = baseId;

        if (equipmentType) query.equipmentType = equipmentType;
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const purchases = await Purchase.find(query)
            .populate('baseId', 'name')
            .populate('recordedBy', 'name')
            .sort({ date: -1 });

        res.json(purchases);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
