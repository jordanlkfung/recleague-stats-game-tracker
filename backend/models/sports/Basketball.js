const mongoose = require('mongoose');
const Game = require('../Game');

const basketballSchemna = mongoose.Schema({
    stat: [{
        required: [true, 'Stats is required.'],
        player: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player',
            required: [true, 'Player is required.'],
        },
        minutes: {
            type: Number,
            required: [true, 'Minutes is required.'],
            default: 0,
        },
        fgm: {
            type: Number,
            required: [true, 'Field goals made is required'],
            default: 0,
        },
        fga: {
            type: Number,
            required: [true, 'Field goals attempts is required'],
            default: 0,
        },
        threeptm: {
            type: Number,
            required: [true, 'Three pointers made is required'],
            default: 0,
        },
        threeptsa: {
            type: Number,
            required: [true, 'Three pointers attempted is required'],
            default: 0,
        },
        ftm: {
            type: Number,
            required: [true, 'Free throws made is required'],
            default: 0,
        },
        fta: {
            type: Number,
            required: [true, 'Free throws made is required'],
            default: 0,
        },
        fgm: {
            type: Number,
            required: [true, 'Free throws attempted is required'],
            default: 0,
        },
        rebounds: {
            type: Number,
            required: [true, 'Rebounds is required'],
            default: 0,
        },
        assists: {
            type: Number,
            required: [true, 'Assists is required'],
            default: 0,
        },
        blocks: {
            type: Number,
            required: [true, 'Blocks is required'],
            default: 0,
        },
        steals: {
            type: Number,
            required: [true, 'Steals is required'],
            default: 0,
        },
        pf: {
            type: Number,
            required: [true, 'Personal fouls is required'],
            default: 0,
        },
        to: {
            type: Number,
            required: [true, 'Turnovers is required'],
            default: 0,
        },
        points: {
            type: Number,
            required: [true, 'Points is required'],
            default: 0,
        },
    }],
});

module.exports = Game.discriminator('Basketball', basketballSchemna);