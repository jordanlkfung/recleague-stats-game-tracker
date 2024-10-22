const mongoose = require('mongoose');

const gameSchema = mongoose.Schema ({
    sport: {
        type: String,
        required: [true, 'Sport category is required.'],
        enum: ['Baseball', 'Basketball', 'Football', 'Soccer', 'Volleyball'], // Drop-down menu selection
    },
    season: {
        type: String,
        required: [true, 'Season is required.'],
        enum: ['Fall', 'Winter', 'Spring', 'Summer'], // Drop-down menu selection
    },
    year: {
        type: Number,
        required: [true, 'Year is required.'],
        min: [2000, 'Year must be 2000 or greater.'],
        max: [2999, 'Year must be 2999 or less.'],
    },
    teams: [{
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Teams are required.'],
        ref: 'Team',
        score: {
            type: Number,
            required: [true, 'Score is required.'],
        }
    }],
    validate: {
        validator: function (value) {
            if(!Array.isArray(value)) return false; // Check if it's an array
            if(value.length !== 2) return false; // Checks if the array has 2 teams
            if(new Set(value.map(String)).size !== 2) return false; // Checks if the two teams are unique by MongoDB Object ID
            return true;
        },
        message: 'There must be exactly 2 different teams in a game.',
    },
    result: [{
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
        }
    }],
});



module.exports = mongoose.model('Game', gameSchema);