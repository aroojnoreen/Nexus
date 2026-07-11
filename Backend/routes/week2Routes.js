const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const { scheduleMeeting, updateMeetingStatus } = require('../controllers/meetingController');
const { uploadDocument } = require('../controllers/documentController');

// Configuration for local file upload storage
const upload = multer({ dest: 'uploads/' });

// Meeting Endpoints
router.post('/meetings', protect, scheduleMeeting);
router.put('/meetings/:id', protect, updateMeetingStatus);

// Document Upload Endpoint
router.post('/documents/upload', protect, upload.single('file'), uploadDocument);

module.exports = router;