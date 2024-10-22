const mongoose = require('mongoose');

const leagueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'League name is required.'],
        unique: true,
        validate: {
            validator: function (value) {
                // validate league name Regex format
            },
        },
    },
    sport: {
        type: String,
        required: [true, 'Sport category is required.'],
        enum: ['Baseball', 'Basketball', 'Football', 'Soccer', 'Volleyball'], // Drop-down menu selection
    },
});

module.exports = mongoose.model('League', leagueSchema);