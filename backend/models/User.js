const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address.'],
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        match: [
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
            'Password must be at least 6 characters long, with at least one letter and one number.'
        ],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    leagues: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'League'
    }],
});

// Custom validation for unique leagues in the leagues array
userSchema.path('leagues').validate(function(value) {
    // Use a Set to ensure all leagues are unique
    return value.length === new Set(value.map(league => league.toString())).size;
}, 'Leagues must be unique.');

module.exports = mongoose.model('User', userSchema);