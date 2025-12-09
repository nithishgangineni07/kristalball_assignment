const express = require('express');
const router = express.Router();
const Transfer = require('../models/Transfer');
const AuditLog = require('../models/AuditLog');
const auth = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');

// @route   POST api/transfers
// @desc    Create asset transfer
// @access  Logistics/Admin
router.post('/', [auth, verifyRole(['logistics', 'admin'])], async (req, res) => {
    const { fromBaseId, toBaseId, equipmentType, quantity, date } = req.body;

    try {
        const transfer = new Transfer({
            fromBaseId,
            toBaseId,
            equipmentType,
            quantity,
            date: date || Date.now(),
            recordedBy: req.user.id
        });

        await transfer.save();

        await new AuditLog({
            action: 'CREATE_TRANSFER',
            collectionName: 'transfers',
            documentId: transfer._id,
            details: transfer.toObject(),
            performedBy: req.user.id
        }).save();

        res.json(transfer);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/transfers
// @desc    List transfers
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const { fromBaseId, toBaseId, equipmentType } = req.query;
        let query = {};

        if (req.user.role === 'commander' && req.user.baseId) {
            // Show transfers involving this base (In or Out)
            query.$or = [{ fromBaseId: req.user.baseId }, { toBaseId: req.user.baseId }];
        } else {
            if (fromBaseId) query.fromBaseId = fromBaseId;
            if (toBaseId) query.toBaseId = toBaseId;
        }

        if (equipmentType) query.equipmentType = equipmentType;

        const transfers = await Transfer.find(query)
            .populate('fromBaseId', 'name')
            .populate('toBaseId', 'name')
            .populate('recordedBy', 'name')
            .sort({ date: -1 });

        res.json(transfers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
