const mongoose = require('mongoose');
const Team = require('../models/Team');
const Player = require('../models/Player');
const User = require('../models/User');
const Game = require('../models/Game')

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
    managers: [{//league managers
        //managers can add/delete teams, assign captains to teams
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    players: [{
        isActive: {
            type: Boolean,
            default: true
        },
        player: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }]
});

leagueSchema.pre('remove', async function (next) {
    try {
        await User.updateMany(
            { _id: { $in: this.managers } },
            { $pull: { leagues: this._id } }
        );

        for (const season of this.seasons) {
            // Delete all teams in the season
            for (const teamId of season.teams) {
                const team = await Team.findById(teamId);
                if (team) {
                    await Player.deleteMany({ _id: { $in: team.roster } });
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