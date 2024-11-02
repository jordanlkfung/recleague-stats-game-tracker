const mongoose = require('mongoose');
const Game = require('../Game');

const basketballSchema = new mongoose.Schema({
    stat: [{
        player: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player',
            required: [true, 'Player is required.'],
        },
        min: {
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
        threeptm: { // 3PM
            type: Number,
            required: [true, 'Three pointers made is required'],
            default: 0,
        },
        threeptsa: { // 3PA
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
        rebounds: { // REB
            type: Number,
            required: [true, 'Rebounds is required'],
            default: 0,
        },
        assists: { // AST
            type: Number,
            required: [true, 'Assists is required'],
            default: 0,
        },
        blocks: { // BLK
            type: Number,
            required: [true, 'Blocks is required'],
            default: 0,
        },
        steals: { // STL
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
        points: { // PTS
            type: Number,
            required: [true, 'Points is required'],
            default: 0,
        },
    }],
});

module.exports = Game.discriminator('Basketball', basketballSchema);