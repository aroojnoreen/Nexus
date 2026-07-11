const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Serverless-safe file upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // If running in production (Vercel), use the safe OS temporary directory
        if (process.env.NODE_ENV === 'production') {
            cb(null, os.tmpdir());
        } else {
            // Locally, continue using your standard uploads folder
            const localPath = 'uploads/';
            if (!fs.existsSync(localPath)) {
                fs.mkdirSync(localPath, { recursive: true });
            }
            cb(null, localPath);
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Import your week 2 controller logic
const { protect } = require('../middleware/authMiddleware');
const { uploadDocument } = require('../controllers/documentController');
const { createMeeting, getAllMeetings } = require('../controllers/meetingController');

// Week 2 Routing Endpoints
router.route('/documents')
    .post(protect, upload.single('file'), uploadDocument); // Removed the broken .get() method!

router.route('/meetings')
    .post(protect, createMeeting)
    .get(protect, getAllMeetings);

module.exports = router;