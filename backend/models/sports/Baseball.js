const mongoose = require('mongoose');
const Game = require('../Game');

const baseballSchema = new mongoose.Schema({
    stat: [{
        player: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player',
            required: [true, 'Player is required.'],
        },
        batting: [{
            ab: {
                type: Number,
                required: [true, 'At Bat is required.'],
                default: 0,
            },
            r: {
                type: Number,
                required: [true, 'Runs is required.'],
                default: 0,
            },
            h: {
                type: Number,
                required: [true, 'Hits is required'],
                default: 0,
            },
            bb: {
                type: Number,
                required: [true, 'Walks is required.'],
                default: 0,
            },
            rbi: {
                type: Number,
                required: [true, 'Runs Batted In is required'],
                default: 0,
            },
            hr: {
                type: Number,
                required: [true, 'Home Runs is required.'],
                default: 0,
            },
        }],
        pitching: [{
            ip: {
                type: Decimal128,
                required: [true, 'Innings Pitches is required.'],
                default: 0.0,
            },
            h: {
                type: Number,
                required: [true, 'Hits allowed is required.'],
                default: 0,
            },
            er: {
                type: Number,
                required: [true, 'Earned Runs allowed is required.'],
                default: 0,
            },
            bb: {
                type: Number,
                required: [true, 'Walks allowed is required.'],
                default: 0,
            },
            so: {
                type: Number,
                required: [true, 'Strikeouts is required.'],
                default: 0,
            },
        }],
    }],
});

module.exports = Game.discriminator('Baseball', baseballSchema);