const Meeting = require('../models/Meeting');

// Schedule a new meeting with conflict detection
exports.scheduleMeeting = async (req, res) => {
    try {
        const { attendee, title, description, startTime, endTime } = req.body;

        // Conflict Detection Check: Checks if user is already booked in an accepted meeting
        const conflict = await Meeting.findOne({
            $or: [
                { host: req.user._id },
                { attendee: req.user._id }
            ],
            status: 'accepted',
            startTime: { $lt: new Date(endTime) },
            endTime: { $gt: new Date(startTime) }
        });

        if (conflict) {
            return res.status(400).json({ message: 'Time slot conflict detected! You are already booked.' });
        }

        const meeting = await Meeting.create({
            host: req.user._id,
            attendee,
            title,
            description,
            startTime,
            endTime
        });

        res.status(201).json(meeting);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Update meeting status (Accept/Reject)
exports.updateMeetingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Expects 'accepted' or 'rejected'

        const meeting = await Meeting.findById(id);
        if (!meeting) return res.status(404).json({ message: 'Meeting not found' });

        meeting.status = status;
        await meeting.save();

        res.json(meeting);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};