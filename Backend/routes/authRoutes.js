const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route (Only accessible with a valid token)
router.get('/profile', protect, (req, res) => {
    res.json({
        message: "Welcome to your protected profile!",
        user: req.user
    });
});

module.exports = router;