const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');

// Create hospital
router.post('/', async (req, res) => {
  try {
    const doc = await Hospital.create(req.body);
    res.status(201).json({ message: 'Hospital created', data: doc });
  } catch (err) {
    res.status(500).json({ message: 'Create failed', error: err.message });
  }
});

// List hospitals
router.get('/', async (req, res) => {
  try {
    const list = await Hospital.find().lean();
    res.json({ message: 'Hospital list', data: list });
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
});

// Update hospital (partial)
router.patch('/:id', async (req, res) => {
  try {
    const doc = await Hospital.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) return res.status(404).json({ message: 'Hospital not found' });
    res.json({ message: 'Updated', data: doc });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
});

module.exports = router;
