const mongoose = require('mongoose');

const options = { discriminatorKey: 'type', collection: 'games' };

const gameSchema = new mongoose.Schema({
    sport: {
        type: String,
        required: [true, 'Sport category is required.'],
        enum: ['Baseball', 'Basketball', 'Football', 'Soccer', 'Volleyball'], // Drop-down menu selection
    },
    date: {
        type: Date,
        required: [true, 'Date is required.'],
        min: ['2000-01-01', 'Date must be in the year 2000 or greater.'],
        max: ['2999-12-31', 'Date must be in the year 2999 or less.'],
    },
    time: {
        type: String,
        required: [true, 'Time is required.'],
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:MM format.'],
    },
    teams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        score: {
            type: Number,
            required: [true, 'Score is required.'],
        }
    }],
    result: {
        winner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team',
            default: null,
        },
        loser: {
            type: mongoose.Schema.Types.ObjectID,
            ref: 'Team',
            default: null,
        },
        tie: {
            type: Boolean,
            required: [true, 'Tie has to be true or false.'],
            default: false,
        }
    },
}, options);

module.exports = mongoose.model('Game', gameSchema);

/**
 * Super class for the different sport(s)
 * Game date is the start date & time
 * If winner and loser exists, tie = false, otherwise true
 */