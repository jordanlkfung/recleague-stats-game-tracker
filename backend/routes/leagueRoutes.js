const express = require('express');
const router = express.Router();
var controller = require('../controllers/leagueController.js')

router.route("")
    .post(controller.addLeague)
    .get(controller.getAllLeagues);

router.route("/:_id")
    .get(controller.getLeagueByID)
    .delete(controller.deleteLeague);

router.route("/:_id/manager")
    .get(controller.getLeagueManagers)
    .post(controller.addManagerToLeague)
    .delete(controller.deleteManagerFromLeague);

router.route("/:_id/playerPool")
    .post(controller.addUserToPlayerPool)
    .get(controller.getPlayerPool)
    .patch(controller.changePlayerStatus)
    .delete(controller.removePlayerFromPlayerPool);

router.route("/sport/:sport")
    .get(controller.getLeaguesBySport)

router.route("/:_id/season")
    .get(controller.getLeagueSeasons)
    .post(controller.addSeasonToSeasons)
    .delete(controller.deleteSeasonFromSeasons);

router.route("/:_id/userStatus")
    .get(controller.getUserStatus);

router.route("/:_id/season/:_sid")
    .get(controller.getSeasonByID);

router.route("/:_id/season/:_sid/team")
    .get(controller.getLeagueTeams)
    .post(controller.addTeamToSeason)
    .delete(controller.deleteTeamFromSeason);

router.route("/:_id/season/:_sid/team/:_tid")
    .get(controller.getTeamByID);

router.route("/:_id/season/:_sid/team/:_tid/player")
    .get(controller.getPlayers)
    .post(controller.addPLayerToRoster)
    .delete(controller.deletePlayerFromRoster);

router.route("/:_id/season/:_sid/game")
    .get(controller.getSeasonGames)
    .post(controller.addGameToSeason)
    .delete(controller.deleteGameFromSeason);


module.exports = router;