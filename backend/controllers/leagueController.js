const mongoose = require('mongoose');
const League = require('../models/League');
const Team = require('../models/Team');
const Player = require('../models/Player');
const User = require('../models/User');
const Game = require('../models/Game')

///////////////////////////
////////// LEAGUE /////////
///////////////////////////
/** /league */
// POST Create new league
exports.addLeague = async function (req, res) {
    var newLeague = new League(req.body);

    try {
        const savedLeague = await newLeague.save();
        res.status(201).json(savedLeague);
    } catch (err) {
        res.status(500).send({ message: 'An error occurred' });
    }
} // League name and sport enums tests PASSED

// GET Get all leagues
exports.getAllLeagues = async function (req, res) {
    try {
        const leagues = await League.find({});
        res.status(200).json(leagues);
    } catch (err) {
        res.status(500).send({ message: 'An error has occurred while getting all Leagues' });
    }
} // Test Passed

/** /league/:_id */
// GET league by id
exports.getLeagueByID = async function (req, res) {
    try {
        const league = await League.findById(req.params._id);
        if (league) {
            res.status(200).json(league);
        } else {
            res.status(404).send({ message: 'League not found.' });
        }
    } catch (err) {
        res.status(500).send({ message: 'An error occurred retrieving League.' });
    }
}; // Test Passed

/** /league/:_id */
// DELETE Delete league
exports.deleteLeague = async function (req, res) {
    const leagueId = req.params._id;

    try {
        const league = await League.findById(leagueId).populate('seasons.teams').exec();

        console.log('Populated');

        if (!league) return res.status(404).json({ message: 'League not found.' });

        // Seasons: Team, Player, and Game
        if (league.seasons && league.seasons.length > 0) {
            for (let season of league.seasons) {
                if (season.teams && season.teams.length > 0) {
                    for (let team of season.teams) {
                        if (team.roster && team.roster.length > 0) {
                            await Player.deleteMany({ _id: { $in: team.roster } });
                        }
        
                        await Team.findByIdAndDelete(team._id);
                    }
                }
        
                if (season.games && season.games.length > 0) {
                    const gameIds = season.games.map(game => game._id);
                    await Game.deleteMany({ _id: { $in: gameIds } });
                }
                
                await League.updateOne(
                    { _id: leagueId },
                    { $pull: { seasons: { _id: season._id } } }
                );
            }
        }
        

        // Managers
        if (league.managers || league.managers.length > 0) {
            await User.updateMany(
                { _id: { $in: league.managers }},
                { $pull: { leagues: leagueId} }
            )
        }

        const result = await League.findByIdAndDelete(leagueId);
        if (result || result.modifiedCount > 0) {
            return res.status(200).json({ message: 'League and all associated data deleted successfully.' });
        } else {
            return res.status(400).json({ message: 'Failed to delete league.' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal server error');
    }
};


/** /:sport */
// :sport is the enum 
// GET Get leagues by sport
exports.getLeaguesBySport = async function (req, res) {
    try {
        const leagues = await League.find({ sport: req.params.sport });
        if (!leagues) {
            return res.status(404).send({ message: 'No leagues with entered sport were found' });
        }
        else {
            res.status(200).json(leagues);
        }
    }
    catch (e) {
        res.status(500).send({ message: 'An error occurred' });
    }
} // Test PASSED

/////////////////////////
///////// USER //////////
/////////////////////////
/** /league/:_id/manager */
// GET Get all managers
exports.getLeagueManagers = async function (req, res) {
    try {
        const league = await League.findById(req.params._id).populate('managers')
        if (!league) {
            res.status(404).send({ message: 'League not found' });
        }
        else {
            res.status(200).send(league.managers);
        }
    }
    catch (e) {
        res.status(500).send({ message: 'An error occurred' });
    }
} // Test Passed

// POST Add managers to league
exports.addManagerToLeague = async function (req, res) {
    const leagueId = req.params._id;
    const managerId = req.body.managerId;

    try {
        const league = await League.findById(leagueId);

        if (!league) return res.status(404).json({ message: 'League not found.' });

        const user = await User.findById(managerId);

        if (!user) return res.status(404).json({ message: 'User not found.' });

        if (!league.managers) return res.status(404).json({ message: 'League\'s managers not found.' });

        const managers = league.managers.filter(item => item.toString() === managerId);

        if (managers.length > 0) {
            return res.status(400).json({ message: 'Manager exists in league.' });
        }

        const leagueResult = await League.updateOne(
            { _id: leagueId },
            { $push: { managers: managerId } }
        );

        const userResult = await User.updateOne(
            { _id: managerId },
            { $push: { leagues: leagueId } }
        );

        if (!userResult || userResult.modifiedCount === 0) {
            await League.updateOne(
                { _id: leagueId },
                { $pull: { managers: managerId } }
            );
            return res.status(500).json({ message: 'Failed to add league to manager. Rollback successful.' });
        }

        return res.status(200).json({
            message: 'Manager successfully added to league and league added to manager.',
            leagueResult,
            userResult
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
} // Test Passed

// DELETE Delete manager from league
exports.deleteManagerFromLeague = async function (req, res) {
    const leagueId = req.params._id;
    const managerId = req.body.managerId;

    try {
        const league = await League.findById(leagueId);

        if (!league) return res.status(404).json({ message: 'League not found.' });

        if (!league.managers) return res.status(404).json({ message: 'League\'s managers not found.' });


        const managers = league.managers.filter(item => item.toString() === managerId);

        if (!managers.length > 0) {
            return res.status(400).json({ message: 'Manager does not exist in league.' });
        }

        const leagueResult = await League.updateOne(
            { _id: leagueId },
            { $pull: { managers: managerId } }
        );

        if (!leagueResult || leagueResult.modifiedCount === 0) {
            return res.status(400).json({ message: 'No changes made to the league\'s managers.' });
        }

        const managerResult = await User.updateOne(
            { _id: managerId },
            { $pull: { leagues: leagueId } }
        );

        if (!managerResult || managerResult.modifiedCount === 0) {
            await League.updateOne(
                { _id: leagueId },
                { $push: { managers: managerId } }
            );
            return res.status(500).json({ message: 'Failed to remove league from manager. Rollback successful.' });
        }

        return res.status(200).json({
            message: 'Manager successfully removed from league and league removed from manager.',
            leagueResult,
            managerResult
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
} // Test PASSED

//////////////////////////
///////// SEASON /////////
//////////////////////////
/** /leagues/:_id/seasons */
// GET Get all seasons
exports.getLeagueSeasons = async function (req, res) {
    try {
        const league = await League.findById(req.params._id);
        
        if (!league) return res.status(404).send({ message: 'League not found' });


        if (!league.seasons) return res.status(404).send({ message: 'Seasons not found' });

        res.status(200).send(league.seasons)
    }
    catch (e) {
        res.status(500).send({ message: 'An error has occurred' })
    }
}  // Test Passed

// POST Add season to seasons
exports.addSeasonToSeasons = async function (req, res) {
    const leagueId = req.params._id;

    try {
        const league = await League.findById(leagueId);

        if (!league) return res.status(404).json({ message: 'League not found.' });

        if (!req.body.start_date || !req.body.end_date) {
            return res.status(400).json({ message: 'Invalid form fields.' });
        }

        const newStartDate = new Date(req.body.start_date);
        const newEndDate = new Date(req.body.end_date);

        if (league.seasons && league.seasons.length > 0) {
            const seasonOverlap = league.seasons.some(season => {
                const existingStartDate = new Date(season.start_date);
                const existingEndDate = new Date(season.end_date);

                return (
                    (newStartDate >= existingStartDate && newStartDate <= existingEndDate) ||
                    (newEndDate >= existingStartDate && newEndDate <= existingEndDate) ||
                    (newStartDate <= existingStartDate && newEndDate >= existingEndDate)
                );
            });

            if (seasonOverlap) {
                return res.status(400).json({ message: 'The new season dates overlap with an existing season.' });
            }
        }

        const result = await League.updateOne(
            { _id: leagueId },
            {
                $push: {
                    seasons: {
                        start_date: newStartDate,
                        end_date: newEndDate,
                        teams: [],
                        games: [],
                    }
                }
            }
        );

        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json({ message: 'No changes made to the league\'s teams.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
} // Test PASSED

// DELETE Delete season from seasons
exports.deleteSeasonFromSeasons = async function (req, res) {
    const leagueId = req.params._id;
    const seasonId = req.body.seasonId;

    try {
        const league = await League.findById(leagueId).populate('seasons.teams').exec();
        if (!league) return res.status(404).json({ message: 'League not found.' });
        if (!league.seasons) return res.status(404).json({ message: 'League\'s seasons not found.' });

        const season = league.seasons.find(item => item._id.toString() === seasonId);
        if (!season) return res.status(400).json({ message: 'Season does not exist in league.' });

        if (season.teams && season.teams.length > 0) {
            for (let i = 0; i < season.teams.length; i++) {
                const team = season.teams[i];

                if (team.roster && team.roster.length > 0) {
                    for (let playerId of team.roster) {
                        await Player.findByIdAndDelete(playerId); 
                    }
                }

                await Team.findByIdAndDelete(team._id);
            }
        }

        if (season.games && season.games.length > 0) {
            for (let i = 0; i < season.games.length; i++) {
                const game = season.games[i];
                if (game) {
                    await Game.findByIdAndDelete(game._id);
                    console.log(game);
                }
            }
        }

        const result = await League.updateOne(
            { _id: leagueId },
            { $pull: { seasons: { _id: seasonId } } }
        );

        if (result.modifiedCount > 0) {
            return res.status(200).json({ message: 'Season and associated data deleted successfully.' });
        } else {
            return res.status(400).json({ message: 'Failed to delete season.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
};


/** /leagues/:_id/seasons/:_sid */
// GET Get season by sid
exports.getSeasonByID = async function (req, res) {
    const leagueId = req.params._id;
    const seasonId = req.params._sid;

    try {
        const league = await League.findById(
            { _id: leagueId }
        );

        if (!league) return res.status(404).send({ message: 'League not found.' });

        const season = league.seasons.find(s => s._id.toString() === seasonId);

        if (!season) return res.status(404).send({ message: 'Season not found.' });

        res.status(200).json(season);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'An error occurred retrieving League.' });
    }
}; // Test Passed

/////////////////////////
///////// TEAM //////////
/////////////////////////
/** /leagues/:_id/season/:_sid/team */
// GET Get all teams in season
exports.getLeagueTeams = async function (req, res) {
    try {
        const league = await League.findById(req.params._id).populate('seasons.teams').exec();

        if (!league) return res.status(404).send({ message: 'An error occurred retrieving League.' });
        
        const season = league.seasons.find(s => s._id.toString() === req.params._sid);

        if (!season) return res.status(404).send({ message: 'An error occurred retrieving Season.' });

        if (!season.teams) return res.status(404).send({ message: 'An error occurred retrieving Team.' });
        
        res.status(200).send(season.teams);
    }
    catch (e) {
        res.status(500).send({ message: 'An error occurred' });
    }
} // Test PASSED

// POST Add team to league
exports.addTeamToSeason = async function (req, res) {
    const leagueId = req.params._id;
    const seasonId = req.params._sid;
    const teamParams = req.body.team;

    try {
        const league = await League.findById(leagueId).populate('seasons.teams').exec();

        if (!league) return res.status(404).json({ message: 'League not found.' });

        const season = league.seasons.find(s => s._id.toString() === req.params._sid);

        if (!season) return res.status(404).send({ message: 'An error occurred retrieving Season.' });

        if (!season.teams) return res.status(404).json({ message: 'An error occurred retrieving Team.' });

        if (!teamParams.name) return res.status(404).json({ message: 'Team name is not included.' });

        const team = season.teams.filter(t => t.name === teamParams.name);
        
        if (team.length > 0) {
            return res.status(400).json({ message: 'Team exists in league.' });
        }

        const newTeam = await new Team(teamParams).save();

        if (!newTeam) return res.status(500).json({ message: 'An error occurred creating Team.' });

        const result = await League.updateOne(
            { _id: leagueId, "seasons._id": seasonId },
            { $push: { "seasons.$.teams": newTeam._id } }
        );

        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json({ message: 'No changes made to the league\'s teams.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
} // Test Passed

// DELETE Delete team from league
exports.deleteTeamFromSeason = async function (req, res) {
    const leagueId = req.params._id;
    const teamId = req.body.teamId;

    try {
        const league = await League.findById(leagueId);

        if (!league) return res.status(404).json({ message: 'League not found.' });

        if (!league.teams) return res.status(404).json({ message: 'League\'s team not found.' });


        const teams = league.teams.filter(item => item.toString() === teamId);

        if (!teams.length > 0) {
            return res.status(400).json({ message: 'Team does not exist in league.' });
        }

        const result = await League.updateOne(
            { _id: leagueId },
            { $pull: { teams: teamId } }
        );

        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json({ message: 'No changes made to the league\'s teams.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
} // Test PASSED

/** /leagues/:_id/season/:_sid/team/:_tid */
exports.getTeamByID = async function (req, res) {
    try {
        const league = await League.findById(req.params._id).populate('seasons.teams').exec();

        if (!league) return res.status(404).send({ message: 'An error occurred retrieving League.' });
        
        const season = league.seasons.find(s => s._id.toString() === req.params._sid);

        if (!season) return res.status(404).send({ message: 'An error occurred retrieving Season.' });

        if (!season.teams) return res.status(404).send({ message: 'An error occurred retrieving Team.' });

        const team = season.teams.find(t => t._id.toString() === req.params._tid);

        if (!team) return res.status(404).send({ message: 'An error occurred retrieving Team.' });
        
        res.status(200).send(team);
    }
    catch (e) {
        res.status(500).send({ message: 'An error occurred' });
    }
} // Test PASSED

/** /leagues/:_id/season/:_sid/team/:_tid/player */
// GET Get team roster
exports.getPlayers = async function (req, res) {
    try {
        const league = await League.findById(req.params._id).populate('seasons.teams').exec();

        if (!league) return res.status(404).send({ message: 'An error occurred retrieving League.' });
        
        const season = league.seasons.find(s => s._id.toString() === req.params._sid);

        if (!season) return res.status(404).send({ message: 'An error occurred retrieving Season.' });

        if (!season.teams) return res.status(404).send({ message: 'An error occurred retrieving Team.' });

        var team = season.teams.find(t => t._id.toString() === req.params._tid);

        if (!team) return res.status(404).send({ message: 'An error occurred retrieving Team.' });

        team = await Team.findById(team._id).populate('roster');

        if (!team.roster) return res.status(404).send({ message: 'An error occurred retrieving Players.' });
        
        return res.status(200).json(team.roster);
    }
    catch (e) {
        res.status(500).send({ message: 'An error occurred' });
    }
} // Test PASSED

/** /leagues/:_id/season/:_sid/team/:_tid/player */
exports.addPLayerToRoster = async function (req, res) {
    const leagueId = req.params._id;
    const seasonId = req.params._sid;
    const teamId = req.params._tid;
    const playerParams = req.body.player;

    try {
        const league = await League.findById(leagueId).populate('seasons.teams').exec();

        if (!league) return res.status(404).json({ message: 'League not found.' });

        const season = league.seasons.find(s => s._id.toString() === seasonId);

        if (!season) return res.status(404).send({ message: 'An error occurred retrieving Season.' });

        const team = season.teams.find(t => t._id.toString() === teamId);

        if (!team) return res.status(404).send({ message: 'An error occurred retrieving Team.' });

        if (!team.roster) return res.status(404).send({ message: 'An error occurred retrieving roster.' });

        const newPlayer = await new Player(playerParams).save();

        if (!newPlayer) return res.status(500).json({ message: 'An error occurred creating Player.' });

        const result = await Team.updateOne(
            { _id: teamId},
            { $push: { "roster": newPlayer._id } }
        );

        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json({ message: 'No changes made to the league\'s teams.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
} // Test PASSED

/** /leagues/:_id/season/:_sid/team/:_tid/player */
// DELETE Delte player from roster
exports.deletePlayerFromRoster = async function (req, res) {
    const leagueId = req.params._id;
    const seasonId = req.params._sid;
    const teamId = req.params._tid;
    const playerToRemove = req.body.player;

    try {
        const league = await League.findById(leagueId).populate('seasons.teams').exec();

        if (!league) return res.status(404).json({ message: 'League not found.' });

        const season = league.seasons.find(s => s._id.toString() === seasonId);

        if (!season) return res.status(404).send({ message: 'An error occurred retrieving Season.' });

        const team = season.teams.find(t => t._id.toString() === teamId);

        if (!team) return res.status(404).send({ message: 'An error occurred retrieving Team.' });

        if (!team.roster) return res.status(404).send({ message: 'An error occurred retrieving roster.' });

        const result = await Team.updateOne(
            { _id: teamId},
            { $pull: { "roster": playerToRemove._id } }
        );

        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json({ message: 'No changes made to the league\'s teams.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
} // Test PASED

/////////////////////////
///////// GAME //////////
/////////////////////////
/** /league/:_id/season/:_sid/game */
// GET Get all games in season
exports.getSeasonGames = async function (req, res) {
    const leagueId = req.params._id;
    const seasonId = req.params._sid;

    try {
        const league = await League.findById(leagueId).populate('seasons.games');

        if (!league) {
            return res.status(404).send({ message: 'League not found.' });
        }

        const season = league.seasons.find(season => season.id.toString() === seasonId);

        if (!season) {
            return res.status(404).send({ message: 'Season not found.' });
        }

        const games = season.games || [];
        res.status(200).json(games);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'An error occurred retrieving League.' });
    }
} // Test PASSED

// POST Add games to season
exports.addGameToSeason = async function (req, res) {
    const leagueID = req.params._id;
    const gameToAdd = req.body.game;
    const seasonID = req.params._sid;

    try { 
        const league = await League.findById(leagueID);
        if (!league)
            return res.status(404).send({ message: "League not found" });

        if (!league.seasons)
            return res.status(400).send({ message: "Seasons does not exist in document" });

        const season = league.seasons.find(s => s._id.toString() === seasonID);

        if (!season)
            return res.status(404).send({ message: "Season not found" });

        var games = [];

        if (!season.games) games = [];
        else games = season.games;

        if (games.length > 0) {
            const game = games.filter(item => item._id.toString() === gameToAdd._id.toString());

            if (game.length > 0)
                return res.status(400).send({ message: "Game already exists" });
        }

        const existGame = await Game.findById(gameToAdd._id);

        if (!existGame) return res.status(400).send({ message: "Game does not exist" });

        const result = await League.updateOne({ _id: leagueID,'seasons._id': seasonID }, { $push: { 'seasons.$.games': gameToAdd._id } });

        if (result)
            res.status(201).send(result);
        else
            res.status(400).send({ message: "No changes were made" })
    }
    catch (e) {
        res.status(500).send({ message: "An error occurred while adding a game to season" })
    }
} // Test PASSED

// DELETE Delete game from season
exports.deleteGameFromSeason = async function (req, res) {
    const leagueID = req.params._id;
    const gameToDelete = req.body.game;
    const seasonID = req.params._sid;

    try { 
        const league = await League.findById(leagueID);
        if (!league)
            return res.status(404).send({ message: "League not found" });

        if (!league.seasons)
            return res.status(400).send({ message: "Seasons does not exist in document" });

        const season = league.seasons.find(s => s._id.toString() === seasonID);

        if (!season)
            return res.status(404).send({ message: "Season not found" });

        var games = [];

        if (!season.games) games = [];
        else games = season.games;

        console.log(games);
        console.log(gameToDelete._id)

        if (games.length > 0) {
            const game = games.filter(item => item._id.toString() === gameToDelete._id.toString());

            if (game.length === 0)
                return res.status(400).send({ message: "Game does not exists" });
        } else {
            return res.status(400).send({ message: "Game is empty" });
        }

        const result = await League.updateOne({ _id: leagueID,'seasons._id': seasonID }, { $pull: { 'seasons.$.games': gameToDelete._id } });
        
        const deletedGame = await Game.findByIdAndDelete(gameToDelete._id);

        if (!deletedGame) {
            await League.updateOne(
                { _id: leagueID, 'seasons._id': seasonID },
                { $push: { 'seasons.$.games': gameToDelete._id } }
            );
            return res.status(500).send({ message: "An error occurred while deleting the game document" });
        }

        if (result)
            res.status(200).send(result);
        else
            res.status(400).send({ message: "No changes were made" })
    }
    catch (e) {
        res.status(500).send({ message: "An error occurred while adding a game to season" })
    }
} // Test PASSED

