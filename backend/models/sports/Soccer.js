const mongoose = require('mongoose');
const Game = require('../Game');

const soccerSchema = new mongoose.Schema({
    stat: {
        player: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player',
            required: [true, 'Player is required.'],
        },
        offensive: [{
            fc: {
                type: Number,
                required: [true, 'Fouls Committed is required.'],
                default: 0,
            },
            fa: {
                type: Number,
                required: [true, 'Fouls Suffered is required.'],
                default: 0,
            },
            yc: {
                type: Number,
                required: [true, 'Yellow Cards is required.'],
                default: 0,
            },
            rc: {
                type: Number,
                required: [true, 'Red Cards is required.'],
                default: 0,
            },
            g: {
                type: Number,
                required: [true, 'Goals is required.'],
                default: 0,
            },
            a: {
                type: Number,
                required: [true, 'Assists is required.'],
                default: 0,
            },
            sh: {
                type: Number,
                required: [true, 'Shots is required.'],
                default: 0,
            },
            st: {
                type: Number,
                required: [true, 'Shots On Target is required.'],
                default: 0,
            },
            of: {
                type: Number,
                required: [true, 'Offsides is required.'],
                default: 0,
            },
        }],
        goalkeeping: [{
            cs: {
                type: Number,
                required: [true, 'Clean Sheet is required.'],
                default: 0,
            },
            sv: {
                type: Number,
                required: [true, 'Saves is required.'],
                default: 0,
            },
            ga: {
                type: Number,
                required: [true, 'Goals Against is required.'],
                default: 0,
            },
        }],
    },
});

module.exports = Game.discriminator('Soccer', soccerSchema);