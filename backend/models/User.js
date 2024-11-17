const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address (ex: stat@example.com).'],
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        match: [
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
            'Password must be at least 6 characters long, with at least one letter and one number.'
        ],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    leagues: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'League'
    }],
});

// Custom validation for unique leagues in the leagues array
userSchema.path('leagues').validate(function(value) {
    // Use a Set to ensure all leagues are unique
    return value.length === new Set(value.map(league => league.toString())).size;
}, 'Leagues must be unique.');

userSchema.pre('save', async function (next) {
    if (this.isModified('email') || this.isNew) {
        try {
            const existingUser = await mongoose.model('User').findOne({ email: this.email });
            if (existingUser) {
                const error = new Error('Email already in use.');
                return next(error);  
            }
        } catch (err) {
            return next(err);  
        }
    }

    if (this.isModified('password') || this.isNew) {
        try {
            const salt = await bcrypt.genSalt(saltRounds);
            this.password = await bcrypt.hash(this.password, salt);
        } catch (err) {
            return next(err);
        }
    }
    next();
});

module.exports = mongoose.model('User', userSchema);