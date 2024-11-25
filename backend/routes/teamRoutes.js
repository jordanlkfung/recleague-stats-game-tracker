const express = require('express');
const router = express.Router();
var controller = require('../controllers/teamController.js');

router.route("").get(controller.getAllTeams).post(controller.addTeam);

router.route("/:_id")
    .get(controller.getTeamByID)
    .delete(controller.deleteTeam);

router.route("/:_id/roster")
    .post(controller.addPlayer)
    .get(controller.getRoster)
    .delete(controller.deletePlayer);

router.route("/:_id/changeName")
    .patch(controller.modifyName);

module.exports = router;