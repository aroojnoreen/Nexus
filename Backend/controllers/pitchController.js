const Pitch = require('../models/Pitch');

// @desc    Create a new project pitch
// @route   POST /api/pitches
// @access  Private (Entrepreneurs Only)
exports.createPitch = async (req, res) => {
    try {
        // Authorization Check: Only allow entrepreneurs to post pitches
        if (req.user.role !== 'entrepreneur') {
            return res.status(403).json({ message: 'Access denied. Only entrepreneurs can create pitches.' });
        }

        const { title, industry, description, businessName, fundingGoal, pitchDeckUrl } = req.body;

        const pitch = await Pitch.create({
            entrepreneur: req.user._id, // Gathered automatically from our working auth middleware!
            title,
            industry,
            description,
            businessName,
            fundingGoal,
            pitchDeckUrl
        });

        res.status(201).json(pitch);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all active pitches (with optional industry filter)
// @route   GET /api/pitches
// @access  Private
exports.getAllPitches = async (req, res) => {
    try {
        let query = { status: 'active' };

        // If the user sent a specific industry filter in the URL, add it to our search query
        if (req.query.industry) {
            query.industry = req.query.industry;
        }

        // Find pitches matching our query and populate owner info
        const pitches = await Pitch.find(query).populate('entrepreneur', 'name email');

        res.json(pitches);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};