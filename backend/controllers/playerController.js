const mongoose = require('mongoose');
const Player = require('../models/Player');

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

exports.getPlayers = async function (req, res) {
    try {
        const players = await Player.find({});

        res.status(200).json(players);
    } catch (error) {
        res.status(500).send({ message: 'An error occured while getting players' })
    }
}

exports.getPlayerByID = async function (req, res) {
    try {
        const player = await Player.findById(req.params._id);

        res.status(200).json(player);
    } catch (error) {
        res.status(500).send({ message: 'An error occured while getting player' })
    }
}

exports.modifyPlayer = async function (req, res) {
    try {
        const player = await Player.findByIdAndUpdate(
            { _id: req.params._id },
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!player) return res.status(404).send({ message: 'Player not found' });

        res.status(200).json(player);
    } catch (error) {
        res.status(500).json(error);
    }
}

exports.deletePlayer = async function (req, res) {
    try {
        const result = await Player.findByIdAndDelete(
            { _id: req.params._id },
        );

        if (!result) return res.status(400).send({ message: 'Error occured in deleting the player' });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
}
