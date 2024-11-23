const mongoose = require('mongoose');
Game = mongoose.model('Game');
const Basketball = require('../models/sports/Basketball');

exports.newGame = async function (req, res) {
    const sport = req.body.sport;
    var game;
    if (sport === 'Basketball')
        game = new Basketball(req.body)
    else
        return res.status(404).send({ message: "Game does not exist" });
    try {
        const newGame = await game.save();
        if (newGame)
            res.status(201).send(newGame);
    }
    catch (e) {
        res.status(500).send({ message: 'An error occurred' });
    }
}
exports.getAllGames = async function (req, res) {
    try {
        const game = await Game.find({});
        res.status(200).send(game);
    }
    catch (e) {
        res.status(500).send({ message: "An error has occurred" });
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
        var updatedGame;
        if (!req.body.tie) {
            updatedGame = Game.findOneAndUpdate({ '_id': req.params._id }, {
                $set: {
                    'teams.$[team1].score': req.body.team1.score,
                    'teams.$[team2].score': req.body.team2.score,
                    'result.winner': req.body.team1._id,
                    'result.loser': req.body.team2._id
                }
            }, {
                arrayFilers: [{ 'team1._id': req.body.team1._id }, //means for the first update _id is equal to the passed in ID
                { 'team2._id': req.body.team2._id }]
            }, {
                new: true
            });
        }
        else {
            //game ended in tie
            updatedGame = Game.findOneAndUpdate({ _id: req.body._id }, {
                $set: {
                    'teams.$[team1].score': req.body.team1.score,
                    'teams.$[team2].score': req.body.team2.score,
                    'result.tie': true
                }

            }, { arrayFilers: [{ 'team1._id': req.body.team1._id }, { 'team2._id': req.body.team2._id }] }, { new: true });
        }
        if (!updatedGame)
            res.status(404).send({ message: "Game not found" });
        else
            res.status(201).send(updatedGame);
    }
    catch (e) {
        res.status(500).send({ message: 'An error occured' });
    }
}

exports.addAllBasketballGameStats = async function (req, res) {
    const gameID = req.params._id;
    try {
        const newGame = await Basketball.findOneAndUpdate(req.params._id, req.body.stats, { new: true });
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
        const updatedGame = await Game.findOne({ '_id': req.params._id });
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
        const gameStats = await Basketball.findOne({ '_id': req.params._id });
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


/** /game/:_id/stats */
//GET stats
exports.getStats = async function (req, res) {
    try {
        let sport = await getSport(req.sport);
        const gameStats = await sport.findById(req.params._id, { stats: 1 });
        if (gameStats) {
            res.status(200).send(gameStats);
        }
        else
            res.status(404).send({ message: 'Game not found' });
    }
    catch (e) {

    }
}

exports.addPlayerGameStats = async function (req, res) {
    var sport = await getSport(req.body.sport)
    try {
        const updatedStats = await sport.findByIdAndUpdate(req.params._id, { $addToSet: { stats: req.body.stats } });
        if (updatedStats) {
            res.status(200).send(updatedStats);
        }
        else
            res.status(404).send({ message: "Game not found" });
    }
    catch (e) {
        res.status(500).send({ message: "An error has occurred" })
    }
}