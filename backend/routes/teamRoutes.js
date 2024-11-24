const express = require('express');
const router = express.Router();
var controller = require('../controllers/teamController.js');

router.route("").get(controller.getAllTeams).post(controller.addTeam);

router.route("/:_id/roster").patch(controller.modifyRoster).get(controller.getRoster);

router.route("/:_id/changeName").patch(controller.modifyName);

module.exports = router;