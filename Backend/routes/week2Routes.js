const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Serverless-safe file upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (process.env.NODE_ENV === 'production') {
            cb(null, os.tmpdir());
        } else {
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
const { scheduleMeeting, updateMeetingStatus } = require('../controllers/meetingController');

// 1. Document Upload Endpoint
router.route('/documents')
    .post(protect, upload.single('file'), uploadDocument);

// 2. Meeting Scheduling Endpoint
router.route('/meetings')
    .post(protect, scheduleMeeting);

// 3. Meeting Status Update Endpoint (Requires ID parameter)
router.route('/meetings/:id')
    .put(protect, updateMeetingStatus);

module.exports = router;