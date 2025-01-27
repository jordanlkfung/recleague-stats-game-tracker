const { thirtyDaysFromNow, fiftenMinutresFromNow } = require('../constants/date');


const defaults = {
    sameSite: "strict",
    httpOnly: true,
    secure: false
    //TODO: CHANGE TO SECURE = TRUE WHEN NOT IN DEVELOPEMENT
}
const SetAuthCookies = ({ res, accessToken, refreshToken }) =>
    res.cookie("accessToken", accessToken, { ...defaults, expires: fiftenMinutresFromNow() })
        .cookie("refreshToken", refreshToken, { ...defaults, expires: thirtyDaysFromNow(), path: "/auth/refresh" });

module.exports = SetAuthCookies;