const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        validate: {
            validator: function (value) {
                // Validate email Regex format
            }
        },
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        validate: {
            validator: function (value) {
                // Validate password Regex format
            },
        },
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

module.exports = mongoose.model('User', userSchema);