const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
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