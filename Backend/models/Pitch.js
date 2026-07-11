const mongoose = require('mongoose');

const PitchSchema = new mongoose.Schema({
    entrepreneur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Links this pitch to a specific User document
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    industry: {
        type: String,
        required: true,
        trim: true // e.g., 'AI', 'SaaS', 'Manufacturing', 'Fintech'
    },
    description: {
        type: String,
        required: true
    },
    businessName: {
        type: String,
        required: true,
        trim: true
    },
    fundingGoal: {
        type: Number,
        required: true
    },
    amountRaised: {
        type: Number,
        default: 0
    },
    pitchDeckUrl: {
        type: String, // Storing document links
        default: ""
    },
    status: {
        type: String,
        enum: ['active', 'funded', 'archived'],
        default: 'active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Pitch', PitchSchema);