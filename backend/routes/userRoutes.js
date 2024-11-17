const express = require('express');
const router = express.Router();
var controller = require('../controllers/userController.js');

router.route("")
    .post(controller.addUser)
    .get(controller.getAllUsers);

router.route("/:_id")
    .get(controller.getUser);

router.route("/:_id/leagues")
    .get(controller.getUserLeagues)
    .patch(controller.modifyLeaguesForUser);

module.exports = router;