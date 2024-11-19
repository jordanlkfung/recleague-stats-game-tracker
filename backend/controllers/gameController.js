const mongoose = require('mongoose');
const Basketball = require('../models/sports/Basketball');
Game = mongoose.model('Game');


exports.newGame = async function (req, res) {
    //TODO: CHECK FOR SPORT AND MAKE MODEL BASED ON THAT
    const { sport, date, time, teams } = req.body;
    const sports = ['Football', 'Soccer', 'Baseball', 'Volleyball', 'Basketball'];
    try {
        if (sport) {
            var newGame;
            if (sport === 'Basketball') {
                newGame = new Basketball({
                    sport: sport,
                    date: date,
                    time: time,
                    teams: teams,
                })
            }
            else if (sport === 'Football') {

            }
            else if (sport === 'Soccer') {

            }
            else if (sport === 'Baseball') {

            }
            else if (sport === 'Volleyball') {

            }
            else {

            }
            if (newGame) {
                const savedGame = newGame.save();
                res.status(201).send({ 'id': savedGame._id });
            }
            res.status(400).send({ message: 'Invalid sport provided' })
        }
        else {
            res.status(400).send({ message: 'No sport provided' })
        }
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
                    'teams.$[team1].score': req.body.team1.score,
                    'teams.$[team2].score': req.body.team2.score,
                    'result.winner': req.body.team1._id,
                    'result.loser': req.body.team2._id
                }
            }, {
                arrayFilers: [{ 'team1._id': req.body.team1._id }, //means for the first update _id is equal to the passed in ID
                { 'team2._id': req.body.team2._id }], new: true
            });
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
        const newGame = await Basketball.findOneAndUpdate(req.body._id, req.body.stats, { new: true });
        if (!newGame) {
            res.status(404).send({ message: 'Game was not found' });
        }
        res.status(200).send(newGame);
    }
    catch (e) {
        res.status(500).send({ message: 'An error has occured' });
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
        res.status(500).send({ message: e });
    }
}

exports.modifyGameTime = async function (req, res) {
    try {
        const newGame = await Game.findByIdAndUpdate(req.params.__id, { $set: { time: req.body.newTime } }, { new: true });
        if (!newGame) {
            res.status(404).send({ message: 'Game not found' });
        }
        else {
            res.status(200).send(newGame);
        }
    }
    catch (e) {
        res.status(500).send({ message: 'An error occured while attempting to change game time' });
    }
}

exports.modifyGameDate = async function (req, res) {
    try {

    }
    catch (e) {

    }
}

