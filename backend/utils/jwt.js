var jwt = require('jsonwebtoken');


const defaults = {
    audience: ['user'],
}


const accessTokenDefaults = {
    ...defaults,
    expiresIn: '15m'
}
const refreshTokenDefaults = {
    ...defaults,
    expiresIn: '30d'
}
const signToken = (payload, options = accessTokenDefaults) => {
    return jwt.sign(payload,
        process.env.JWT_REFRESH_SECRET,
        options
    )
}

const verifyToken = (token) => {
    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_REFRESH_SECRET,
            { ...defaults }
        );
        return { payload }
    }
    catch (error) {
        return {
            error: error.message
        }
    }
}
module.exports = {
    signToken,
    verifyToken,
    accessTokenDefaults,
    refreshTokenDefaults
}