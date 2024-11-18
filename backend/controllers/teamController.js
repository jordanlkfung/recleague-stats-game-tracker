const mongoose = require('mongoose');
Team = mongoose.model('Team');


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

exports.modifyLeagues = async function (req, res) {
    const { leaguesToJoin, leaguesToLeave } = req.body;
    try {
        const updateObj = {}
        if (leaguesToJoin) {
            updateObj.$addToSet = isArray(leaguesToJoin) ? { leagues: { $each: leaguesToJoin } } : { leagues: updateObj };
        }
        if (leaguesToLeave) {
            updateObj.$pull = isArray(leaguesToLeave) ? { leagues: { $each: leaguesToLeave } } : { leagues: leaguesToJoin };
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
