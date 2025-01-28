const { thirtyDaysFromNow, fifteenMinutesFromNow, } = require('./date');

const REFRESH_PATH = "/user/refresh";

const defaults = {
    sameSite: "strict",
    httpOnly: true,
    secure: false
    //TODO: CHANGE TO SECURE = TRUE WHEN NOT IN DEVELOPEMENT
}
const accessTokenCookieOptions = {
    ...defaults, expires: fifteenMinutesFromNow()
}
const refreshTokenCookieOptions = {
    ...defaults, expires: thirtyDaysFromNow(), path: REFRESH_PATH
}
const setAuthCookies = ({ res, accessToken, refreshToken }) =>
    res.cookie("accessToken",
        accessToken,
        accessTokenCookieOptions)
        .cookie("refreshToken",
            refreshToken,
            refreshTokenCookieOptions);


const clearAuthCookies = (res) =>
    res
        .clearCookie("accessToken")
        .clearCookie("refreshToken", { path: REFRESH_PATH });
module.exports = { setAuthCookies, clearAuthCookies, refreshTokenCookieOptions, accessTokenCookieOptions, REFRESH_PATH };