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
        teams: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team'
        }],
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
    }],
    managers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
});

// Custom validation for unique mangaers in the managers array
leagueSchema.path('managers').validate(function (value) {
    // Use a Set to ensure all managers are unique
    return value.length === new Set(value.map(manager => manager.toString())).size;
}, 'Managers must contain unique managers.');

leagueSchema.pre('remove', async function (next) {
    try {
        // Iterate over seasons in the league
        for (const season of this.seasons) {
            // Delete all teams in the season
            for (const teamId of season.teams) {
                const team = await Team.findById(teamId);
                if (team) {
                    // Delete all players in the team's roster
                    await Player.deleteMany({ _id: { $in: team.roster } });
                    // Delete the team itself
                    await team.remove();
                }
            }

            // Delete all games in the season
            await Game.deleteMany({ _id: { $in: season.games } });
        }

        next(); // Proceed to remove the league
    } catch (err) {
        next(err); // Pass error to the next middleware
    }
});


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