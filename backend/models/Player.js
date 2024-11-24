const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema ({
   name: {
        type: String,
        required: [true, 'Player name is required.'],
        match: [/^[A-Za-z\s]{2,50}$/, 'Player name must be between 2 and 50 characters long and can only include letters and spaces.'],
   },
   birthdate: {
        type: Date,
        required: [true, 'birthdate is required.'],
   },
   sex: {
        type: String,
        required: [true, 'Sex is required.'],
        enum: ['Male', 'Female'], // Drop-down menu selection
   },
   height: {
    feet: {
        type: Number,
        required: [true, 'Feet required.'], // Drop-down menu selection
        min: [0, 'Feet cannot be negative.'],
    },
    inches: {
        type: Number,
        required: [true, 'Inches required.'], // Drop-down menu selection
        min: [0, 'Inches cannot be negative.'],
        max: [11, 'Inches must be at most 11.'], 
    },
   },
   weight: {
        type: Number,
        required: [true, 'Weight required.'], 
        min: [0, 'Weight(lbs) cannot be negative.'],
   },
   position: {
     type: String,
     required: [true, 'Position is required.'],
   },
});

module.exports = mongoose.model('Player', playerSchema);

/**
 * In League Settings: managers inpute teams and then players
 * There will be multiple player profiles of the same person
 * New player profiles per league, so someone who plays n sports in n legaues has n profiles
 * 
 * Profile:
 * Name
 * Birthday
 * Sex
 * Measurements
 * League
 * 
 * Stats:
 * Total 
 * Season (Chronological order)
 */