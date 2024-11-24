const mongoose = require('mongoose');
const Basketball = require('../models/sports/Basketball');
const Game = require('../models/Game');

/** /game */
//POST
exports.newGame = async function (req, res) {
    const sport = req.body.sport;

    if (sport === 'Basketball') {
        try {
            console.log('Game is Basketball');
            const game = new Basketball(req.body);
    
            if (!game) return res.status(500).json({ message: 'Create basketball game error.'  });
            console.log("Created game: ", game);

            console.log('Saving game');
            const newGame = await game.save();
            if (!newGame) return res.status(500).json({ message: 'Saving basketball game error.'  });

            return res.status(201).json(newGame);
        }
        catch (e) {
            console.log(e);
            res.status(500).send({ message: 'An error occurred' });
        }
    }
    else {
        return res.status(404).send({ message: "Sport does not exist" });
    }
} // Test Passed

//GET
exports.getAllGames = async function (req, res) {
    try {
        const game = await Game.find({});
        res.status(200).send(game);
    }
    catch (e) {
        res.status(500).send({ message: "An error has occurred" });
    }
} // Test Passed

/** /game/:_id */

//GET get game
exports.getGame = async function (req, res) {
    const gameID = req.params._id;
    try {
        const game = await Game.findById(gameID);
        if (!game)
            res.status(404).send({ message: "Game not found" });
        else
            res.status(200).send(game);
    }
    catch (e) {
        res.status(500).send({ message: "An error has occurred" });
    }
} // Test PASSED

//DELETE delete game
exports.deleteGame = async function (req, res) {
    const gameID = req.params._id;
    try {
        console.log(gameID);
        const game = await Game.findById(gameID);
        console.log(game);
        if (!game)
            return res.status(404).send({ message: "Game does not exist" });
        console.log(game !== null);
        const result = await Game.deleteOne({ _id: gameID });
        if (result)
            res.status(200).send({ message: "Delete successful" });
        else
            res.status(404).send({ message: "An error has occurred" });
    }
    catch (e) {
        res.status(500).send({ message: "An error has occurred" });
    }
} // Test PASSED

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


/** /game/:_id/changeTeam */
exports.changeTeam = async function (req, res) {
    const { teamToRemove, teamToAdd } = req.body;
    const gameID = req.params._id;

    try {
        const game = await Game.findById(gameID);

        if (!game)
            return res.status(404).send({ message: "Game not found" });

        const teams = game.teams.filter(team => team.toString() === "teamToRemove");

        if (!teams)
            return res.status(404).send({ message: "Team to remove does not exist" });

        const result = await Game.updateOne({ _id: gameID }, { $pull: teamToRemove, $push: teamToAdd });

        if (result)
            res.status(200).send(result);
        else
            res.status(400).send({ message: "No updates were made" });
    }
    catch (e) {
        res.status(500).send({ message: "An error occurred" });
    }
}

/** /team/:_id/modifyGame */
exports.modifyGame = async function (req, res) {
    const { newDate, newTime } = req.body;
    const gameID = req.params._id;

    try {
        const game = await Game.findById(gameID);

        if (!game)
            return res.status(404).send({ message: "Game not found" });

        const updateObj = {};

        if (newDate)
            updateObj.date = newDate;
        if (newTime)
            updateObj.time = newTime;

        if (newDate || newTime) {
            const result = await Game.updateOne({ _id: gameID }, updateObj);
            if (!result)
                res.status(400).send({ message: "No updates were made" });
            else
                res.status(200).send(result)
        }
        else
            res.status(400).send({ message: "No fields provided for update" });
    }
    catch (e) {
        res.status(500).send({ message: "An error has occurred" });
    }
}
