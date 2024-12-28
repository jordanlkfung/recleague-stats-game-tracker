var mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { tryCatch } = require('../utils/tryCatch');


// req.params._id is the ObjectID of the User Document
// Updating leagues needs the League's ObjectID in the request body (leagueId)

/** /user */
// POST Register
exports.addUser = tryCatch(async function (req, res) {
    var newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
}); // Duplicate email, invalid email, and invalid password tests PASSED

// GET Get all users
exports.getAllUsers = tryCatch(async function (req, res) {
    const users = await User.find({});
    res.status(200).json(users);
}); // Test PASSED

//PATCH update or add height, weight
exports.updateUser = tryCatch(async function (req, res) {
    const { height, weight } = req.body;
    const { feet, inches } = height;
    const user = await User.findById(req.params._id);

    if (!user) throw new AppError(404, 'User not found');

    const update = await User.updateOne({ _id: req.params._id },
        {
            $set: {
                weight: weight,
                "height.feet": feet,
                "height.inches": inches
            }
        }
    );

    if (update) {
        return res.status(204).send(update);
    }
    else {
        throw new AppError(304, "No changes were made to user");
    }

});

// POST Login
exports.login = tryCatch(async function (req, res) {
    const { email, password } = req.body;

    const user = await mongoose.model('User').findOne({ email });


    if (!user) {
        throw new AppError(404, 'User not found.')
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new AppError(401, 'Invalid email or password')
    }

    return res.status(200).send({ message: 'Login successful', user: { _id: user._id, email: user.email } });

});


/** /user/:_id */
// GET user by id 
exports.getUser = tryCatch(async function (req, res) {

    const user = await User.findById(req.params._id);
    if (user) {
        return res.status(200).json(user);
    } else {
        throw new AppError(404, 'User not found.');
    }

}); // Test Passed

/** /user/:_id/leagues */
// GET user's league(s)'
exports.getUserLeagues = tryCatch(async function (req, res) {

    const user = await User.findById(req.params._id);

    if (!user) {
        throw new AppError(404, 'User not Found'); // Can populate leagues array with the League objects instead of ids
    }

    if (user.leagues.length > 0) {
        await user.populate('leagues');
    }

    return res.status(200).json(user.leagues);

}); // Test Passed

// POST 
exports.addLeagueToUser = tryCatch(async (req, res) => {
    const userId = req.params._id;
    const leagueId = req.body.leagueId;

    const user = await User.findById(userId);

    if (!user) throw new AppError(404, 'User not found');

    if (!user.leagues) throw new AppError(404, 'User\'s leagues not found.');

    const leagues = user.leagues.filter(item => item.toString() === leagueId);

    if (leagues.length > 0) {
        throw new AppError(404, 'League exists for the user.');
    }

    const result = await User.updateOne(
        { _id: userId },
        { $push: { leagues: leagueId } }
    );

    if (result) {
        return res.status(200).json(result);
    } else {
        throw new AppError(400, 'No changes made to the user\'s leagues.');
    }

}); // Test Passed

// DELETE Delete a user's league
exports.deleteLeagueFromUser = tryCatch(async (req, res) => {
    const userId = req.params._id;
    const leagueId = req.body.leagueId;


    const user = await User.findById(userId);

    if (!user) throw new AppError(404, 'User not found');

    if (!user.leagues) throw new AppError(404, 'User\'s leagues not found.');

    const leagues = user.leagues.filter(item => item.toString() === leagueId);

    if (!leagues.length > 0) {
        throw new AppError(404, 'League exists does not for the user.');
    }

    const result = await User.updateOne(
        { _id: userId },
        { $pull: { leagues: leagueId } }
    );

    if (result) {
        return res.status(200).json(result);
    } else {
        throw new AppError(400, 'No changes made to the user\'s leagues.');
    }

}); // Test PASSED