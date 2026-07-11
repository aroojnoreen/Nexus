const express = require('express');
const router = express.Router();
const { createPitch, getAllPitches } = require('../controllers/pitchController');
const { protect } = require('../middleware/authMiddleware');

// Route configurations
router.route('/')
    .post(protect, createPitch)  // Protected endpoint (needs token)
    .get(protect, getAllPitches); // Protected marketplace browse

module.exports = router;