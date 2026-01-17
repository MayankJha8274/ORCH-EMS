const express = require('express');
const router = express.Router();
const { dispatchEmergency } = require('../services/dispatchService');

// POST /api/dispatch { emergencyId }
router.post('/', async (req, res) => {
  try {
    const { emergencyId } = req.body;
    if (!emergencyId) return res.status(400).json({ message: 'emergencyId required' });
    const result = await dispatchEmergency(emergencyId);
    res.json({ message: 'Dispatched', data: result });
  } catch (err) {
    res.status(500).json({ message: 'Dispatch failed', error: err.message });
  }
});

module.exports = router;
