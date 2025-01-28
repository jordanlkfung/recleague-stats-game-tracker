const { CREATED, OK, NOT_FOUND, BAD_REQUEST, UNAUTHORIZED } = require('../constants/https');
const AppError = require('../AppError');
const { tryCatch } = require('../utils/tryCatch');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Session = require('../models/Session');
const User = require('../models/User');
const { signToken, refreshTokenDefaults, verifyToken } = require('../utils/jwt');
const { setAuthCookies, clearAuthCookies, accessTokenCookieOptions } = require('../utils/cookies');


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