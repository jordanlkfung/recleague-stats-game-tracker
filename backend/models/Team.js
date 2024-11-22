const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Team name/mascot is required.'],
        match: [/^[A-Za-z\s]{3,30}$/, 'Team name must be between 3 and 30 characters long and can only include letters and spaces.'],
    },
    sport: {
        type: String,
        required: [true, 'Sport category is required.'],
        enum: ['Baseball', 'Basketball', 'Football', 'Soccer', 'Volleyball'], // Drop-down menu selection
    },
    leagues: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'League',
    }],
    roster: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
    }],
    games: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
    }],
});

// Custom validation for unique players in the roster array
teamSchema.path('roster').validate(function (value) {
    // Use a Set to ensure all players are unique
    return value.length === new Set(value.map(player => player.toString())).size;
}, 'Roster must contain unique players.');

// Custom validation for unique games in the games array
teamSchema.path('games').validate(function (value) {
    // Use a Set to ensure all players are unique
    return value.length === new Set(value.map(game => game.toString())).size;
}, 'Games must contain unique games.');

module.exports = mongoose.model('Team', teamSchema);

/**
 * Team page displays three main sections: Profile, Schedule, and Stats
 * 
 * Team Name: Location & Mascot
 * 
 * Roster: (players)
 * 
 * Profile:
 * Upcoming game(s) // Filtered by leagues
 * 
 * Schedule:
 * Games (chronological order)
 *      - Filters: Game Season & Leagues
 * 
 * Stats:
 * Total Stats (if only this, move to profile and remove stats section)
 * Seasonal Stats (maybe?)
 *      - Filters: Leagues
 */