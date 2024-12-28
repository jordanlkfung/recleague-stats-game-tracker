const express = require('express');
const router = express.Router();
var controller = require('../controllers/userController.js');

router.route("")
    .post(controller.addUser)
    .get(controller.getAllUsers)
    .patch(controller.updateUser);

router.route("/login")
    .post(controller.login);

router.route("/:_id")
    .get(controller.getUser);

router.route("/:_id/leagues")
    .get(controller.getUserLeagues)
    .post(controller.addLeagueToUser)
    .delete(controller.deleteLeagueFromUser);

module.exports = router;