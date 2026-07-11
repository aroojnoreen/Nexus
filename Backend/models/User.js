const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['entrepreneur', 'investor'],
        required: true
    },
    // Entrepreneur specific fields
    businessName: { type: String, trim: true },
    pitchDeck: { type: String }, // Will hold a URL link later
    fundingGoal: { type: Number },
    
    // Investor specific fields
    investmentInterests: [{ type: String }], // Array of industries (e.g., ['AI', 'SaaS'])
    budgetRange: { type: String }
}, {
    timestamps: true // Automatically manages createdAt and updatedAt fields
});

// Pre-save middleware to hash password automatically before saving
UserSchema.pre('save', async function () {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return;
    }

    try {
        // Generate a salt (random data added to the hash)
        const salt = await bcrypt.genSalt(10);
        // Hash the password using the salt
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw new Error(error);
    }
});

// Helper method to compare entered password with hashed password during login
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model('User', UserSchema);