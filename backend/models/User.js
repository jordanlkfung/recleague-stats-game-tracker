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
    firstName: {
        type: String,
        // required: [true, 'name is required.'],
        match: [/^[A-Za-z\s]{2,50}$/, 'Player name must be between 2 and 50 characters long and can only include letters and spaces.'],
    },
    lastName: {
        type: String,
        // required: [true, 'name is required.'],
        match: [/^[A-Za-z\s]{2,50}$/, 'Player name must be between 2 and 50 characters long and can only include letters and spaces.'],
    },
    birthdate: {
        type: Date,
        // required: [true, 'birthdate is required']
    },
    sex: {
        type: String,
        // required: [true, 'sex is required'],
        enum: ['Male', 'Female'], // Drop-down menu selection
    },
    height: {
        feet: {
            type: Number,
            min: [0, 'Feet cannot be negative.'],
        },
        inches: {
            type: Number,
            min: [0, 'Inches cannot be negative.'],
            max: [11, 'Inches must be at most 11.'],
        },
    },
    weight: {
        type: Number,
        min: [0, 'Weight(lbs) cannot be negative.'],
    },
    leagues: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'League',
    }],
});

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

userSchema.methods.omitPassword = function () {
    const user = this.toObject();
    delete user.password;
    return user
}
module.exports = mongoose.model('User', userSchema);