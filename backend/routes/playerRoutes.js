const express = require('express');
const router = express.Router();
var controller = require('../controllers/playerController');

router.route("")
    .post(controller.createPlayer)
    .get(controller.getPlayers);

router.route("/:_id")
    .get(controller.getPlayerByID)
    .patch(controller.modifyPlayer)
    .delete(controller.deletePlayer);

module.exports = router;

