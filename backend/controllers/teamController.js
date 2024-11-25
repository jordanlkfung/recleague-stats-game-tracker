const mongoose = require('mongoose');
const Team = require('../models/Team');
const Player = require('../models/Player');

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

exports.getTeamByID = async function (req, res) {
    try {
        const team = await Team.findById(req.params._id);
        res.status(200).send(team);
    }
    catch (e) {
        res.status(500).json(e);
    }
}
/** /team/:_id/roster */
//GET Get team roster
exports.getRoster = async function (req, res) {
    try {
        const team = await Team.findById(req.params._id).populate('roster');

        console.log(team);

        if (!team) {
            res.status(404).send({ message: 'Team not found' });
        }
        else {
            res.status(200).send(team.roster);
        }
    }
    catch (e) {
        res.status(500).send({ message: 'An error occured while fetching rosters' });
    }
}

exports.addPlayer = async function (req, res) {
    const playerId = req.body.playerId;

    try {
        console.log(playerId);

        const team = await Team.findById(req.params._id);       
        
        if (!team.roster) return res.status(404).send({ message: 'Roster not found' });

        const roster = team.roster.filter(p => p._id.toString() === playerId);

        if (roster && roster.length > 0) return res.status(400).send({ message: 'Player already exists in roster' });

        const result = await Team.findByIdAndUpdate(
            { _id: req.params._id },
            { $push: { roster: playerId } }
        );

        if (result || result.modifiedCount > 0) {
            return res.status(200).send({ message: 'Success' });
        } else {
            return res.status(400).send({ message: 'Error while pushing player ID from roster' });
        }
    }
    catch (e) {
        res.status(500).send({ message: 'An error occured while adding player to team roster' });
    }
}

exports.deletePlayer = async function (req, res) {
    const playerId = req.body.playerId;

    try {
        console.log(playerId);

        const team = await Team.findById(req.params._id);       
        
        if (!team.roster) return res.status(404).send({ message: 'Roster not found' });

        const roster = team.roster.filter(p => p._id.toString() === playerId);

        if (!roster || roster.length === 0) return res.status(400).send({ message: 'Player does not exist in roster' });

        const result = await Team.findByIdAndUpdate(
            { _id: req.params._id },
            { $pull: { roster: playerId } }
        );

        if (result || result.modifiedCount > 0) {
            return res.status(200).send({ message: 'Success' });
        } else {
            return res.status(400).send({ message: 'Error while pulling player ID from roster' });
        }
    } catch (e) {
        res.status(500).send({ message: 'An error occured while adding player to team roster' });
    }
}


/** /team/:_id/changeName */
//PATCH
exports.modifyName = async function (req, res) {
    try {
        console.log(req.body);

        const updatedName = await Team.findByIdAndUpdate(
            { _id: req.params._id },
            { $set: { name: req.body.name } }, 
            { new: true, runValidators: true});

        if (updatedName)
            res.status(200).send(updatedName);
        else
            res.status(404).send({ message: 'Team not found' });
    }
    catch (e) {
        res.status(500).send({ message: 'An error has occurred' });
    }
}


exports.deleteTeam = async function (req, res) {
    try {
        const team = await Team.findById(req.params._id).populate('roster');

        if (!team) return res.status(404).send({ message: 'Team cannot be found' })

        if (!team.roster) return res.status(404).send({ message: 'Roster cannot be found' })

        const rosterResult = await Player.deleteMany(
            { _id: { $in: team.roster } }
        );

        const teamResult = await Team.findByIdAndDelete(req.params._id);

        if (teamResult && rosterResult) {
            return res.status(200).send('Successfully deleted team and its players');
        } else {
            return res.status(400).send({ message: 'Team Deletion Error' })
        }
    } catch (error) {
        res.status(500).json(error);
    }
}


// MAYBE DO ON FRONTEND/ EXTRA FEATURE
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