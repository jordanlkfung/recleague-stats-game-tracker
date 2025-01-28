const { UNAUTHORIZED } = require("../constants/https");
const { verifyToken } = require("../utils/jwt")

const authenticate = (req, res, next) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) throw new AppError(UNAUTHORIZED, "Invalid access token");

    const { error, payload } = verifyToken(accessToken);

    if (!payload) throw new AppError(UNAUTHORIZED, error === "jwt expired" ? "Token expired" : "Invalid token");

    console.log(payload)

    req.userId = payload.userId;
    req.sessionId = payload.sessionId;

    next();
}

module.exports = authenticate