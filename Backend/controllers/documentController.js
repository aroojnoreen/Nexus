const Document = require('../models/Document');

exports.uploadDocument = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const doc = await Document.create({
            uploadedBy: req.user._id,
            fileName: req.file.originalname,
            filePath: req.file.path
        });

        res.status(201).json({ message: 'File saved successfully!', doc });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};