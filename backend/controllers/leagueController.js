const mongoose = require('mongoose');
League = mongoose.model('League');

/** /league */
// POST Create new league
exports.addLeague = async function (req, res) {
    var newLeague = new League(req.body);

    try {
        const savedLeague = await newLeague.save();
        res.status(201).json(savedLeague);
    } catch (err) {
        res.status(500).send({message: err});
    }
} // League name and sport enums tests PASSED

// GET Get all leagues
exports.getAllLeagues = async function (req, res) {
    try {
        const leagues = await League.find({});
        res.status(200).json(leagues);
    } catch (err) {
        res.status(500).send({message: 'An error has occured while getting all Leagues'});
    }
}

/** /leagues/:_id/managers */
// GET Get all managers
exports.getLeagueManagers = async function (req, res) {

}

// PATCH Add or remove managers
exports.modifyManagersForLeague = async function (req, res) {

};

/** /leagues/:_id/teams*/
// GET Get all teams
exports.getLeagueTeams = async function (req, res) {

}

// PATCH Add or remove teams
exports.modifyTeamsForLeague = async function (req, res) {

}

/** /leagues/:_id/seasons */
// GET Get all seasons
exports.getLeagueSeasons = async function (req, res) {

}

// PATCH Add or remove seasons
exports.modifySeasonsForLeague = async function (req, res) {

}
