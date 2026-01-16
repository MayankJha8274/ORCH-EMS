const express = require('express');
const router = express.Router();
const Ambulance = require('../models/Ambulance');

// Create ambulance
router.post('/', async (req, res) => {
  try {
    const doc = await Ambulance.create(req.body);
    res.status(201).json({ message: 'Ambulance created', data: doc });
  } catch (err) {
    res.status(500).json({ message: 'Create failed', error: err.message });
  }
});

// List ambulances
router.get('/', async (req, res) => {
  try {
    // find() → fetches all ambulances , .lean() → returns plain JS objects ( faster , less memory )
    const list = await Ambulance.find().lean();
    res.json({ message: 'Ambulance list', data: list });
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
});

// Update ambulance (partial)
router.patch('/:id', async (req, res) => {
  try {
    const doc = await Ambulance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) return res.status(404).json({ message: 'Ambulance not found' });
    res.json({ message: 'Updated', data: doc });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
});

module.exports = router;
