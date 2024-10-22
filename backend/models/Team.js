const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Team name/mascot is required.'],  
        validate: {
            validator: function (value) {
                // validate team name Regex format
            },
        },
    },
    sport: {
        type: String,
        required: [true,'Sport category is required.'],
        enum: ['Baseball', 'Basketball', 'Football', 'Soccer', 'Volleyball'], // Drop-down menu selection
    },
    // Add players
    // roster : [{}],
    games : [{
        game: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Game is required.'],
            unique: true,
        },
    }]
});

module.exports = mongoose.model('Team', teamSchema);