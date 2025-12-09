const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Expenditure = require('../models/Expenditure');
const AuditLog = require('../models/AuditLog');
const auth = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');

// @route   POST api/assignments
// @desc    Assign asset to personnel
// @access  Commander/Admin
router.post('/', [auth, verifyRole(['commander', 'admin'])], async (req, res) => {
    const { baseId, equipmentType, quantity, assignedTo, date } = req.body;

    // If commander, force baseId to be their own
    if (req.user.role === 'commander' && req.user.baseId) {
        if (baseId && baseId !== req.user.baseId) {
            return res.status(403).json({ msg: 'Cannot assign assets from another base' });
        }
    }

    try {
        const assignment = new Assignment({
            baseId: req.user.role === 'commander' ? req.user.baseId : baseId,
            equipmentType,
            quantity,
            assignedTo,
            date: date || Date.now(),
            recordedBy: req.user.id
        });

        await assignment.save();

        await new AuditLog({
            action: 'CREATE_ASSIGNMENT',
            collectionName: 'assignments',
            documentId: assignment._id,
            details: assignment.toObject(),
            performedBy: req.user.id
        }).save();

        res.json(assignment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/assignments
// @desc    List assignments
router.get('/', auth, async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'commander') {
            query.baseId = req.user.baseId;
        } else if (req.query.baseId) {
            query.baseId = req.query.baseId;
        }

        const assignments = await Assignment.find(query)
            .populate('baseId', 'name')
            .populate('recordedBy', 'name')
            .sort({ date: -1 });

        res.json(assignments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/assignments/expend
// @desc    Record expenditure
// @access  Commander/Admin
router.post('/expend', [auth, verifyRole(['commander', 'admin'])], async (req, res) => {
    const { baseId, equipmentType, quantity, reason, date } = req.body;

    if (req.user.role === 'commander' && req.user.baseId) {
        if (baseId && baseId !== req.user.baseId) {
            return res.status(403).json({ msg: 'Cannot expend assets from another base' });
        }
    }

    try {
        const expenditure = new Expenditure({
            baseId: req.user.role === 'commander' ? req.user.baseId : baseId,
            equipmentType,
            quantity,
            reason,
            date: date || Date.now(),
            recordedBy: req.user.id
        });

        await expenditure.save();

        await new AuditLog({
            action: 'CREATE_EXPENDITURE',
            collectionName: 'expenditures',
            documentId: expenditure._id,
            details: expenditure.toObject(),
            performedBy: req.user.id
        }).save();

        res.json(expenditure);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
