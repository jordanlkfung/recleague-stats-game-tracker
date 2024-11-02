const mongoose = require('mongoose');
const Game = require('../Game');

const basketballSchemna = new mongoose.Schema({
    stat: [{
        player: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player',
            required: [true, 'Player is required.'],
        },
        sp: {
            type: Number,
            required: [true, 'Sets Played required.'],
            default: 0,
        },
        k: {
            type: Number,
            required: [true, 'Kills is required.'],
            default: 0,
        },
        ta: { // Attacks
            type: Number,
            required: [true, 'Total Attempts is required.'],
            default: 0,
        },
        a: {
            type: Number,
            required: [true, 'Aces is required'],
            default: 0,
        },
        dig: {
            type: Number,
            required: [true, 'Digs is required.'],
            default: 0,
        },
        blk: {
            type: Number,
            required: [true, 'Blocks is required.'],
            default: 0,
        },
        e: { // Total errors
            type: Number,
            required: [true, 'Errors is required.'],
            default: 0,
        },
    }],
});

module.exports = Game.discriminator('Basketball', basketballSchemna);