const mongoose = require('mongoose');
const { thirtyDaysFromNow } = require('../constants/date');
const SessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        index: true,
    },
    userAgent: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true
    },
    expiresAt: {
        type: Date,
        default: thirtyDaysFromNow()
    },
})

module.exports = mongoose.model("Session", SessionSchema)
