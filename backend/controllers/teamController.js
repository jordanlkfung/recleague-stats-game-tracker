const mongoose = require('mongoose');
Team = mongoose.model('Team');

exports.getRoster = async function (req, res) {
    try {
        const roster = Team.findOne({ _id: req.params._id }, { roster: 1 }).populate('roster');
        res.status(200).send(roster);
    }
    catch (e) {
        res.status(500).send({ message: e });
    }
}

exports.getGames = async function (req, res) {
    try {
        const games = Team.findOne({ _id: req.params._id }, { games: 1 }).populate('games');
        res.status(200).send(games);
    }
    catch (e) {
        res.status(500).send({ message: e })
    }
}

