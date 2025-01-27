const { thirtyDaysFromNow, fifteenMinutesFromNow, } = require('../constants/date');


const defaults = {
    sameSite: "strict",
    httpOnly: true,
    secure: false
    //TODO: CHANGE TO SECURE = TRUE WHEN NOT IN DEVELOPEMENT
}
const REFRESH_PATH = "/auth/refresh";
const SetAuthCookies = ({ res, accessToken, refreshToken }) =>
    res.cookie("accessToken",
        accessToken,
        { ...defaults, expires: fifteenMinutesFromNow() })
        .cookie("refreshToken",
            refreshToken,
            { ...defaults, expires: thirtyDaysFromNow(), path: REFRESH_PATH });


const clearAuthCookies = (res) =>
    res
        .clearCookie("accessToken")
        .clearCookie("refreshToken", { path: REFRESH_PATH });
module.exports = { SetAuthCookies, clearAuthCookies };