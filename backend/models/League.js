const mongoose = require('mongoose');

const leagueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'League name is required.'],
        unique: true,
        match: [/^[A-Za-z\s]{3,100}$/, 'Team name must be between 3 and 100 characters long and can only include letters and spaces.'],
    },
    sport: {
        type: String,
        required: [true, 'Sport category is required.'],
        enum: ['Baseball', 'Basketball', 'Football', 'Soccer', 'Volleyball'], // Drop-down menu selection
    },
    seasons: [{
        start_date: {
            type: Date,
            required: [true, 'Start date is required.'],
        },
        end_date: {
            type: Date,
            required: [true, 'End date is required.'],
            validate: {
                validator: function (value) {
                    return value > this.start_date;
                },
                message: 'End date must be after start date.',
            }
        },
        games: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Game'
        }],
        uniqueIdentifier: {
            type: String,
            unique: true
        },
        complete: {
            type: Boolean,
            required: [true, 'Completed season is required.'],
        },
    }],
    managers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    teams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
    }],
});

//Generating Unique Identifier for seasons
leagueSchema.pre('save', function (next) {
    seasons.forEach(season => {
        season.uniqueIdentifier = season.start_date.toISOString().split('T')[0].replace(/-/g, '') + season.end_date.toISOString().split('T')[0].replace(/-/g, '');
    });
})

// Custom validation for unique mangaers in the managers array
leagueSchema.path('managers').validate(function (value) {
    // Use a Set to ensure all managers are unique
    return value.length === new Set(value.map(manager => manager.toString())).size;
}, 'Managers must contain unique managers.');

// Custom validation for unique teams in the teams array
leagueSchema.path('teams').validate(function (value) {
    // Use a Set to ensure all teams are unique
    return value.length === new Set(value.map(team => team.toString())).size;
}, 'Teams must contain unique teams.');

// Add presave for name, seasons, managers, and teams uniqueness
// Figure out a way to automate seasons id (maybe startdate and enddate combined)

module.exports = mongoose.model('League', leagueSchema);

/**
 * Profile:
 * Upcoming Games
 * Scores (completed games from current season)
 * 
 * Standings:
 * Team Name
 * Record 
 *      - Filters: Seasons
 * 
 * Schedule:
 * Reverse chronological order
 *      - Filters: Seasons
 */