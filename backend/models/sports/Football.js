const mongoose = require('mongoose');
const Game = require('../Game');

const footballSchema = new mongoose.Schema({
    stat: [{
        player: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player',
            required: [true, 'Player is required.'],
        },
        offense: [{
            pyds: {
                type: Number,
                required: [true, 'Passing Yards is required.'],
                default: 0,
            },
            ptd: {
                type: Number,
                required: [true, 'Passing Touchdowns is required.'],
                default: 0,
            },
            int: {
                type: Number,
                required: [true, 'Interceptions thrown is required.'],
                default: 0,
            },
            sacks: {
                type: Number,
                required: [true, 'Sacks taken is required.'],
                default: 0,
            },
            reyds: {
                type: Number,
                required: [true, 'Reception Yards is required.'],
                default: 0,
            },
            retd: {
                type: Number,
                required: [true, 'Reception Touchdowns is required.'],
                default: 0,
            },
            ruyds: {
                type: Number,
                required: [true, 'Rushing Yards is required.'],
                default: 0,
            },
            rutd: {
                type: Number,
                required: [true, 'Rushing Touchdowns is required.'],
                default: 0,
            },
            fum: {
                type: Number,
                required: [true, 'Fumbles is required.'],
                default: 0,
            },
        }],
        defense: [{
            tck: {
                type: Number,
                required: [true, 'Tackles is required.'],
                default: 0,
            },
            sacks: {
                type: Number,
                required: [true, 'Sacks is required.'],
                default: 0,
            },
            int: {
                type: Number,
                required: [true, 'Interceptions is required.'],
                default: 0,
            },
            fum: {
                type: Number,
                required: [true, 'Fumbles recovered is required.'],
                default: 0,
            },
            td: {
                type: Number,
                required: [true, 'Touchdowns is required.'],
                default: 0,
            }
        }],
    }],
});

module.exports = Game.discriminator('Football', footballSchema);