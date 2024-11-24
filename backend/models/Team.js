const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Team name/mascot is required.'],
        match: [/^[A-Za-z\s]{3,30}$/, 'Team name must be between 3 and 30 characters long and can only include letters and spaces.'],
    },
    roster: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
    }],
    games: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
    }],
});

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