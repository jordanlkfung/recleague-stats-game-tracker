const mongoose = require('mongoose');

const leagueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    }
});

module.exports = mongoose.model('League', leagueSchema);