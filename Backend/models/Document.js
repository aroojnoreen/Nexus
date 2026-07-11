const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    status: { type: String, default: 'pending_signature' }
}, { timestamps: true });

module.exports = mongoose.model('Document', DocumentSchema);