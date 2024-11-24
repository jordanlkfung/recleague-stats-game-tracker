const mongoose = require('mongoose');
Team = mongoose.model('Team');

/** /team */
//GET get all teams
exports.getAllTeams = async function (req, res) {
    try {
        const teams = await Team.find({});
        res.status(200).send(teams);
    }
    catch (e) {
        res.status(500).send({ message: 'An error occured' });
    }
}
//POST Add team
exports.addTeam = async function (req, res) {
    var team = new Team(req.body)
    try {
        const newTeam = await team.save();
        res.status(201).send(newTeam);
    }
    catch (e) {
        res.status(500).send({ message: 'An error occured' });
    }
}
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

/** /team/:_id/changeName */
//PATCH
exports.modifyName = async function (req, res) {
    //]ADD CHECK TO SEE IF NEW NAME FITS?
    try {
        const updatedName = await Team.findByIdAndUpdate(req.params._id, { $set: { name: req.body.name } }, { new: true });
        if (updatedName)
            res.status(200).send(updatedName);
        else
            res.status(404).send({ message: 'Team not found' });
    }
    catch (e) {
        res.status(500).send({ message: 'An error has occurred' });
    }
}

/** /team/:_id/recentGames */
//GET recent games
/**
 * number of games passed from query params
 * if number of games requested > number of games return all games
 */
exports.getGamesBeforeDate = async function (req, res) {
    const offset = req.query.offset || 10;
    try {
        const games = await Team.find({ '_id': req.params._id, games: { $lt: ISODate(req.query.date) } }).limit(req.query.limit).select({ games: 1 });
    }
    catch (e) {

    }
}