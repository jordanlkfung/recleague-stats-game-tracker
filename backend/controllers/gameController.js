const mongoose = require('mongoose');
const Basketball = require('../models/sports/Basketball');
const Game = require('../models/Game');
const Team = require('../models/Team');

/** /game */
//POST
exports.newGame = async function (req, res) {
    const sport = req.body.sport;

    if (sport === 'Basketball') {
        try {
            console.log('Game is Basketball');
            const game = new Basketball(req.body);

            if (!game) return res.status(500).json({ message: 'Create basketball game error.' });
            console.log("Created game: ", game);

            console.log('Saving game');
            const newGame = await game.save();
            if (!newGame) return res.status(500).json({ message: 'Saving basketball game error.' });

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
    const gameID = req.params._id;

    try {
        const game = await Game.findById(gameID);

        if (!game) {
            return res.status(404).send({ message: "Game not found" });
        }

        if (game.teams.length !== 2) {
            return res.status(400).send({ message: "Game must have exactly two teams" });
        }

        const team1 = game.teams[0];
        const team2 = game.teams[1];

        let winner = null;
        let loser = null;
        let tie = false;

        if (team1.score > team2.score) {
            winner = team1.team;
            loser = team2.team;
            tie = false;
        } else if (team1.score < team2.score) {
            winner = team2.team;
            loser = team1.team;
            tie = false;
        } else {
            tie = true;
        }

        const resultUpdate = {
            winner: winner,
            loser: loser,
            tie: tie
        };

        const result = await Game.findByIdAndUpdate(gameID, { result: resultUpdate }, { new: true });

        if (!result) {
            return res.status(400).send({ message: "Failed to update game result" });
        }

        return res.status(200).send(result);
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: 'An error occurred' });
    }
};


exports.modifyScore = async function (req, res) {
    const teamId = req.body.teamId;
    const newScore = req.body.newScore;
    const gameID = req.params._id;

    try {
        const game = await Game.findById(gameID);

        if (!game)
            return res.status(404).send({ message: "Game not found" });

        for (let item of game.teams) {
            console.log('passed')
            if (item.team._id.toString() === teamId) {
                item.score = newScore;

                const result = game.save();

                if (!result) return res.status(400).send({ message: 'Update Score Error' });


                return res.status(200).send({ message: 'Success' });
            }
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

        const teamAdd = await Team.findById(teamToAdd);
        const teamRemove = await Team.findById(teamToRemove);

        var addResult = false;
        var removeResult = false;

        if (teamAdd && game.teams.length < 2) {
            const addExists = game.teams.filter(t => t._id.toString() === teamToAdd);

            if (addExists.length > 0) return res.status(400).send({ message: 'Team exists already' });

            addResult = await Game.updateOne(
                { _id: gameID },
                { $push: { 'teams': { team: teamAdd._id } } }
            );
        }


        if (teamRemove) {
            removeResult = await Game.updateOne(
                { _id: gameID },
                { $pull: { 'teams': { team: teamRemove._id } } }
            );
        }


        const result = {
            add: addResult.acknowledged === true,
            remove: removeResult.acknowledged === true,
        }

        console.log('passed');

        if (addResult || removeResult) {
            return res.status(200).json(result);
        } else {
            res.status(400).send({ message: "No updates were made" });
        }
    }
    catch (e) {
        res.status(500).send({ message: "An error occurred" });
    }
}

/** /team/:_id/modifyDate */
exports.modifyDate = async function (req, res) {
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

exports.updateStats = async function (req, res) {
    const gameID = req.params._id;
    const { playerId, statUpdates } = req.body;

    try {
        const game = await Game.findById(gameID);

        if (!game) {
            return res.status(404).send({ message: "Game not found" });
        }

        const sport = game.sport;
        let validKeys = [];

        if (sport === 'Basketball') {
            validKeys = [
                'min', 'fgm', 'fga', 'threeptm', 'threeptsa', 'ftm', 'fta',
                'rebounds', 'assists', 'blocks', 'steals', 'pf', 'to', 'points'
            ];
        }
        else {
            return res.status(404).send({ message: "Sport does not exist" });
        }

        for (let key in statUpdates) {
            if (!validKeys.includes(key)) {
                return res.status(400).send({ message: `Invalid stat key: ${key} for sport ${sport}` });
            }
        }

        let playerStat = null;
        for (let stat of game.stat) {
            if (stat.player.toString() === playerId) {
                playerStat = stat;
                break;
            }
        }

        console.log(playerStat)


        if (!playerStat) {
            const newStat = {
                player: playerId,
                ...statUpdates
            };

            game.stat.push(newStat);
        } else {
            for (let key in statUpdates) {
                playerStat[key] = statUpdates[key];
            }
        }

        const result = await game.save();

        if (!result) {
            return res.status(400).send({ message: "Failed to update stats" });
        }

        return res.status(200).send(result);
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: "An error occurred" });
    }
};


//GET
/** /game/team/:_id */
exports.getTeamGames = async function (req, res) {
    const teamId = req.params._id;

    try {
        const games = await Game.find({ 'teams.team': teamId }).populate('teams.team').populate('result.winner').populate('result.loser');

        if (!games)
            return res.status(404).send({ message: "No games found" });

        return res.status(200).send(games);
    }
    catch (e) {
        return res.status(500).send({ message: "An error occurred while getting team games" })
    }
}