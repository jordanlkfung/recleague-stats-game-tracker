const mongoose = require('mongoose')
Game = mongoose.model('Game');

exports.newGame = async function (req, res) {
    var newGame = req.body;
    try {
        const savedGame = newGame.save();
        res.status(201).json(savedGame);
    }
    catch (e) {
        res.status(500).send({ message: e });
    }
}
exports.getTeams = async function (req, res) {
    try {
        const teams = await Game.find({ _id: req.params._id }, { teams: 1 }).populate();
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
