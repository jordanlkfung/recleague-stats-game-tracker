const express = require('express');
const router = express.Router();
var controller = require('../controllers/userController.js');

router.route("")
    .post(controller.addUser)
    .get(controller.getAllUsers);

router.route("/login")
    .post(controller.login);

router.route("/:_id")
    .get(controller.getUser)
    .patch(controller.updateUser);

router.route("/:_id/leagues")
    .get(controller.getUserLeagues)
    .post(controller.addLeagueToUser)
    .delete(controller.deleteLeagueFromUser);

router.route("/:_id/fieldCheck")
    .post(controller.checkUserInformation);

router.route("/info")
    .post(controller.retrieveUser)
    .patch(controller.userUpdate);
module.exports = router;