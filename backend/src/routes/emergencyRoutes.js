const express = require('express');
const router = express.Router();
const Emergency = require('../models/Emergency');

// GET /api/emergencies - Get all emergencies
router.get('/', async (req, res) => {
    try {
        const list = await Emergency.find().sort({ createdAt: -1 }).lean();
        res.json({ message: 'List of emergencies', data: list });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch emergencies', error: err.message });
    }
});

// POST /api/emergencies - Create new emergency
router.post('/', async (req, res) => {
    try {
        const payload = req.body;
        if (!payload || !payload.type) {
            return res.status(400).json({ message: 'type is required' });
        }
        const doc = await Emergency.create(payload);
        res.status(201).json({ message: 'Emergency created', data: doc });
    } catch (err) {
        res.status(500).json({ message: 'Save failed', error: err.message });
    }
});

module.exports = router;