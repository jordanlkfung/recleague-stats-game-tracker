const mongoose = require('mongoose');
const Basketball = require('../models/sports/Basketball');
Game = mongoose.model('Game');


exports.newGame = async function (req, res) {
    //TODO: CHECK FOR SPORT AND MAKE MODEL BASED ON THAT
    const { sport, date, time, teams } = req.body;
    const sports = ['football', 'soccer', 'baseball', 'volleyball', 'basketball'];
    try {
        if (req.body.sport)
            var newGame = req.body;
        if (req.body.sport === 'basketball') {
            newGame = new Basketball({
                sport: sport,
                date: date,
                time: time,
                teams: teams,
            })
        }
        else if (req.body.sport === 'football') {

        }
        else if (req.body.sport === 'soccer') {

        }
        else if (req.body.sport === 'baseball') {

        }
        else if (req.body.sport === 'volleyball') {

        }
        const savedGame = newGame.save();
        res.status(201).json({ 'id': savedGame._id });
    }
    catch (e) {
        res.status(500).send({ 'message': e });
    }
}
exports.getTeams = async function (req, res) {
    try {
        const teams = await Game.find({ _id: req.params._id }, { teams: 1 }).populate('teams');
        res.status(200).json(teams);
    }
    catch (e) {
        res.status(500).send({ message: e })
    }
}
exports.setResult = async function (req, res) {
    //when there is a winning and losing team, team1 will be the winning team, team2 will be the losing team
    try {
        if (!req.body.tie) {
            const updatedGame = Game.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    'teams.$[team].score': req.body.team1.score,
                    'teams.$[team].score': req.body.team2.score,
                    'result.winner': req.body.team1._id,
                    'result.loser': req.body.team2._id
                }
            }, { arrayFilers: [{ '_id': req.body.team1._id }, { '_id': req.body.team2._id }], new: true });
            res.status(201).send(updatedGame);
        }
        else {
            //game ended in tie
            const updatedGame = Game.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    'teams.$[team].score': req.body.team1.score,
                    'teams.$[team].score': req.body.team2.score,
                    'result.tie': true
                }

            }, { arrayFilers: [{ '_id': req.body.team1._id }, { '_id': req.body.team2._id }], new: true });
            res.status(201).send(updatedGame);
        }
    }
    catch (e) {
        res.status(500).send({ message: e })
    }
}

exports.addAllBasketballGameStats = async function (req, res) {
    try {
        const newGame = await Basketball.findOneAndUpdate(req.body._id, req.body.stats);
    }
    catch (e) {

    }
}

exports.updateBasketballGameStats = async function (req, res) {
    try {
        const updatedGame = await Basketball.findOneAndUpdate({ '_id': req.body._id },
            { $set: { 'stats': req.body.stats } },
            { new: true }
        )
    }
    catch (e) {
        res.status(500).send({ message: e })
    }
}

exports.updateGameScore = async function (req, res) {
    try {
        Game.updateOne(
            { _id: req.body._id, 'teams._id': req.body.team1 },
            { $set: { 'teams.$.score': req.body.team1.score } }
        )
            .then(() => {
                return Game.updateOne(
                    { _id: req.body._id, 'teams._id': req.body.team2 },
                    { $set: { 'teams.$.score': req.body.team2.score } }
                );
            })
        res.status(200);
    }
    catch (e) {

    }
}

exports.updateGameStatsAndResults = async function (req, res) {
    try {
        const updatedGame = await Game.findOne({ '_id': req.body._id });
        if (updatedGame) {
            updatedGame.team[req.body.team1].score = req.body.team1.score;
            updatedGame.team[req.body.team2].score = req.body.team2.score;
            if (req.body.tie) {
                updatedGame.result.tie = true;
            } else {
                updatedGame.result.winner = req.body.team1;
                updatedGame.result.loser = req.body.team2;
            }
            updatedGame.save();
            res.status(200).send(updatedGame);
        }
    }
    catch (e) {
        res.status(500).send({ message: e })
    }
}
exports.getAllBasketballGameStats = async function (req, res) {
    try {
        const gameStats = await Basketball.findOne({ '_id': req.body._id });
        res.send(gameStats.stats);
    }
    catch (e) {
        res.status(500).send({ message: e })
    }
}

