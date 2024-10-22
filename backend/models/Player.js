const mongoose = require('mongoose');

const playerSchema = mongoose.Schema ({
   name: {
        type: String,
        required: [true, 'Player name is required.'],
   },
   birthdate: {
        type: Date,
        required: [true, 'birthdate is required.'],
        min: [new Date(new Date().setFullYear(new Date().getFullYear() - 6)), 'Player must be 6 years old or older.'], 
        max: [new Date(new Date().setFullYear(new Date().getFullYear() + 100)), 'Player must be 100 years old or younger.'],
        validation: {
            validator: function (value) {
                // Validate birthdate Regex format
            },
        },
   },
   sex: {
        type: String,
        required: [true, 'Sex is required.'],
        enum: ['Male', 'Female'], // Drop-down menu selection
   },
   height: {
    required: [true, 'Height required.'],
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
   leagues: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'League',
        required: [true, 'League required.'],
   }],
   teams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'League',
        required: [true, 'Team required.'],
   }],
});



module.exports = mongoose.model('player', playerSchema);