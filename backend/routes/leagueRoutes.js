const express = require('express');
const router = express.Router();
var controller = require('../controllers/leagueController.js')

router.route("")
    .post(controller.addLeague)
    .get(controller.getAllLeagues);

router.route("/:_id")
    .get(controller.getLeague);

router.route("/:_id/managers")
    .get(controller.getLeagueManagers)
    .post(controller.addManagerToLeague)
    .delete(controller.deleteManagerFromLeague);

router.route("/:_id/teams")
    .get(controller.getLeagueTeams)
    .post(controller.addTeamToLeague)
    .delete(controller.deleteTeamFromLeague);

router.route("/:_id/seasons")
    .get(controller.getLeagueSeasons)
    .post(controller.addSeasonToSeasons)
    .delete(controller.deleteSeasonFromSeasons);

router.route("/:_id/season/:_sid")
    .get(controller.getSeason)
    .post(controller.addGameToSeason)
    .delete(controller.deleteGameFromSeason);

router.route("/:sport").get(controller.getLeaguesBySport)

module.exports = router;