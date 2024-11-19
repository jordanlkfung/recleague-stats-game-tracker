const express = require('express');
const router = express.Router();
var controller = require('../controllers/leagueController.js')

router.route("")
    .post(controller.addLeague)
    .get(controller.getAllLeagues);

router.route("/:_id/managers")
    .get(controller.getLeagueManagers)
    .patch(controller.modifyManagersForLeague);

// router.route("/:_id/teams")
//     .get(controller.getLeagueTeams)
//     .patch(controller.modifyTeamsForLeague);

router.route("/:_id/seasons")
    .get(controller.getLeagueSeasons)
    .patch(controller.modifySeasonsForLeague);

router.route("/:sport").get(controller.getLeaguesBySport)

module.exports = router;