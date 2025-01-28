var mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { tryCatch } = require('../utils/tryCatch');
const AppError = require('../AppError');
const { CREATED, OK, NOT_FOUND, BAD_REQUEST, UNAUTHORIZED } = require('../constants/https');
const { setAuthCookies, clearAuthCookies, accessTokenCookieOptions } = require('../utils/cookies');
const Session = require('../models/Session');
const { signToken, refreshTokenDefaults, accessTokenDefaults, verifyToken } = require('../utils/jwt');
const { thirtyDaysFromNow } = require('../utils/date');

// req.params._id is the ObjectID of the User Document
// Updating leagues needs the League's ObjectID in the request body (leagueId)

/** /user */
// POST Register
exports.addUser = tryCatch(async function (req, res) {
    const existingUser = await User.exists({ email: req.email });
    if (existingUser) return res.status(500).json({ message: "User already exists" });
    var newUser = new User(req.body);
    const savedUser = await newUser.save();

    const session = await Session.create({
        userId: newUser._id
    });
    const refreshToken = signToken({ sessionId: session._id }, refreshTokenDefaults);

    const accessToken = signToken({
        userId: newUser._id,
        sessionId: session._id
    })

    return setAuthCookies({ res, accessToken, refreshToken })
        .status(CREATED)
        .json(savedUser);
}); // Duplicate email, invalid email, and invalid password tests PASSED

// GET Get all users
exports.getAllUsers = tryCatch(async function (req, res) {
    const users = await User.find({});
    res.status(OK).json(users);
}); // Test PASSED

//PATCH update or add height, weight
exports.updateUser = tryCatch(async function (req, res) {
    //TODO: ADD VALIDATION
    // const { height, weight, name, sex, birthdate } = req.body;
    // const { feet, inches } = height;
    const user = await User.findById(req.params._id);

    if (!user) throw new AppError(NOT_FOUND, 'User not found');

    const update = await User.updateOne({ _id: req.params._id },
        {
            // $set: {
            //     weight: weight,
            //     "height.feet": feet,
            //     "height.inches": inches
            // }
            $set: req.body,

        }
    );

    if (update) {
        return res.status(204).send({ status: 'Success', rowsModified: update.modifiedCount });
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

    const session = await Session.create({
        userId: user._id
    });

    const refreshToken = signToken({ sessionId: session._id }, refreshTokenDefaults);

    const accessToken = signToken({
        userId: user._id,
        sessionId: session._id
    });

    return setAuthCookies({ res, accessToken, refreshToken })
        .status(OK).send({ message: 'Login successful', user: { _id: user._id, email: user.email } });

});

exports.logout = tryCatch(async function (req, res) {
    const accessToken = req.cookies.accessToken;

    const { payload, error } = verifyToken(accessToken);

    if (!payload) throw new AppError(UNAUTHORIZED, error)
    if (payload) {
        await Session.findByIdAndDelete(payload.sessionId);
    }
    return clearAuthCookies(res).status(OK).json({ message: "Logout Successful" })

});

exports.refresh = tryCatch(async function (req, res) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) throw new AppError(UNAUTHORIZED, "No refresh token");

    const { payload, error } = verifyToken(refreshToken);


    if (!payload) throw new AppError(UNAUTHORIZED, error || "Invalid Refresh Token");

    const session = await Session.findById(payload.sessionId);

    //Checking if session exists, or session is expired
    if (!session || session.expiresAt.getTime() > Date.now()) throw new AppError(UNAUTHORIZED, "Session Expired");


    const accessToken = signToken({ userId: session.userId, sessionId: session._id });

    //refreshing session if it expires within 24 hours
    const refreshNeeded = session.expiresAt.getTime() - Date.now() <= 24 * 60 * 60 * 1000;
    if (refreshNeeded) {
        session.expiresAt = thirtyDaysFromNow();
        await session.save();
        const newRefreshToken = refreshNeeded && signToken({ sessionId: session._id }, refreshTokenDefaults);
        return setAuthCookies(res, accessToken, newRefreshToken).json({ message: "Access Token Refreshed" });
    }

    return res.status(OK).cookies("accessToken", accessToken, accessTokenCookieOptions).json({ message: "Access Token Refreshed" });

})

/** /user/:_id */
// GET user by id 
exports.getUser = tryCatch(async function (req, res) {
    const user = await User.findById(req.params._id).select({ password: 0, createdAt: 0 });
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
        throw new AppError(404, 'User not Found.'); // Can populate leagues array with the League objects instead of ids
    }

    if (user.leagues.length > 0) {
        await user.populate('leagues');
    }

    return res.status(200).send(user.leagues);

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

/** /user/:_id/fieldCheck */
//POST checks if user has empty fields
exports.checkUserInformation = tryCatch(async (req, res) => {
    const userId = req.params._id;

    const user = await User.findById(userId);

    if (!user) throw new AppError(404, 'User not found');

    const hasEmptyFields = !user.name || !user.birthdate || !user.sex || !user.height?.feet || !user.height?.inches || !user.weight;
    console.log(hasEmptyFields);
    return res.status(201).send({ hasEmptyFields: hasEmptyFields });
});

/** /user/info */
//Get
exports.retrieveUser = tryCatch(async function (req, res) {

    const { userId } = req;

    const user = await User.findById(userId);
    if (user) {
        return res.status(200).json(user.omitPassword());
    } else {
        throw new AppError(404, 'User not found.');
    }

});
//PATCH
exports.userUpdate = tryCatch(async function (req, res) {

    const { userId } = req
    const user = await User.findById(userId);

    if (!user) throw new AppError(404, 'User not found');

    const update = await User.updateOne({ _id: userId },
        {
            $set: req.body,

        }
    );

    if (update) {

        return res.status(204).send(update);
    }
    else {
        throw new AppError(304, "No changes were made to user");
    }

});
