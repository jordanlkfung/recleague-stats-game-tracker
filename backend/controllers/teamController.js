const mongoose = require('mongoose');
const Team = require('../models/Team');
Team = mongoose.model('Team');

/** /team/:_id/roster */
//GET Get team roster
exports.getRoster = async function (req, res) {
    try {
        const roster = Team.findById(req.params._id, { roster: 1 }).populate('roster');
        if (!roster) {
            res.status(404).send({ message: 'Team not found' });
        }
        else {
            res.status(200).send(roster);
        }
    }
    catch (e) {
        res.status(500).send({ message: 'An error occured while fetching rosters' });
    }
}

// PATCH add or remove players
exports.modifyRoster = async function (req, res) {
    const { playersToAdd, playersToRemove } = req.body;
    try {
        const updateObj = {}
        if (playersToAdd)
            updateObj.$addToSet = Array.isArray(playersToAdd) ? { roster: { $each: playersToAdd } } : { roster: playersToRemove };
        if (playersToRemove)
            updateObj.$pull = Array.isArray(playersToRemove) ? { roster: { $in: playersToRemove } } : { roster: playersToRemove };
        if (playersToAdd || playersToRemove) {
            const updatedRoster = await Team.findByIdAndUpdate(req.params._id, updateObj, { new: true });
            if (updatedRoster)
                res.status(200).send(updatedRoster);
            else
                res.status(404).send({ message: 'Team does not exist' });
        }
        else {
            res.status(400).send({ message: 'No update field provided' });
        }
    }
    catch (e) {
        res.status(500).send({ message: 'An error occured' });
    }
}

/** /team/:_id/games */
//GET Get team games
exports.getGames = async function (req, res) {
    try {
        const games = Team.findOne({ _id: req.params._id }, { games: 1 }).populate('games.game');
        if (!games) {
            res.status(404).send({ message: 'Team not found' });
        }
        else {
            res.status(200).send(games);
        }
    }
    catch (e) {
        res.status(500).send({ message: e })
    }
}
//PATCH add or remove games
exports.modifyGames = async function (req, res) {
    const { gamesToAdd, gamesToRemove } = req.body;
    try {
        const updateObj = {};
        if (gamesToAdd) {
            updateObj.$addToSet = Array.isArray(gamesToAdd) ? { games: { $each: gamesToAdd } } : { games: gamesToAdd };
        }
        if (gamesToRemove) {
            updateObj.$pull - Array.isArray(gamesToRemove) ? { games: { $in: gamesToRemove } } : { games: gamesToRemove };
        }

        if (gamesToRemove || gamesToAdd) {
            const updatedGame = await Team.findByIdAndUpdate(req.params._id, updateObj, { new: true });
            if (updatedGame) {
                res.status(200).send(updatedGame);
            }
            else {
                res.status(404).send({ message: 'Team not found' })
            }
        }
        else {
            res.status(400).send({ message: 'No update fields provided' });
        }
    }
    catch (e) {
        res.status(500).send({ message: 'An error occured' });
    }
}

//**  /team/:id/leagues */
//GET Get leagues a team is in
exports.getLeagues = async function (req, res) {
    try {
        const leagues = await Team.findById(req.params._id, { leagues: 1 }).populate('leauges');
        if (!leagues) {
            res.status(404).send({ message: 'Team not found' });
        }
        else {
            res.status(200).send(leagues);
        }
    }
    catch (e) {
        res.status(500).send({ message: 'An error occured' });
    }
}
// PATCH join or leave leagues
exports.modifyLeagues = async function (req, res) {
    const { leaguesToJoin, leaguesToLeave } = req.body;
    try {
        const updateObj = {}
        if (leaguesToJoin) {
            updateObj.$addToSet = isArray(leaguesToJoin) ? { leagues: { $each: leaguesToJoin } } : { leagues: updateObj };
        }
        if (leaguesToLeave) {
            updateObj.$pull = isArray(leaguesToLeave) ? { leagues: { $in: leaguesToLeave } } : { leagues: leaguesToJoin };
        }

        if (leaguesToJoin || leaguesToLeave) {
            const team = await Team.findByIdAndUpdate(req.params._id, updateObj, { new: true });
            if (!team) {
                res.status(404).send({ message: 'Team not found' });
            }
            else {
                res.status(200).send(team)
            }
        }
        else {
            res.status(400).send({ message: 'No valid fields provided for update.' });
        }
    }
    catch (e) {
        res.status(500).send({ message: 'An error has occured' });
    }
}

/** /team/:_id/changeName */
//PATCH
exports.modifyName = async function (req, res) {
    //ADD CHECK TO SEE IF NEW NAME FITS?
    try {
        const updatedName = await Team.findByIdAndUpdate(req.params._id, { $set: { name: req.body.name } }, { new: true });
        if (updatedName)
            res.status(200).send(updatedName);
        else
            res.status(404).send({ message: 'Team not found' });
    }
    catch (e) {
        res.status(500).send({ message: 'An error has occured' });
    }
}