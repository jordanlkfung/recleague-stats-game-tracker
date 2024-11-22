const mongoose = require('mongoose');
Player = mongoose.model('Player');

exports.createPlayer = async function (req, res) {
    var player = new Player(req.body);
    try {
        const newPlayer = await player.save();
        res.status(201).send(newPlayer);
    }
    catch (e) {
        res.status(500).send({ message: 'An error occured while creating a new player' })
    }
}
