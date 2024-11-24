const express = require('express');
const router = express.Router();
var controller = require('../controllers/gameController');

router.route("")
    .post(controller.newGame)
    .get(controller.getAllGames);

router.route("/:_id")
    .get(controller.getGame)
    .delete(controller.deleteGame);

router.route("/:_id/modifyGame").
    patch(controller.modifyGame);

router.route("/:_id/changeTeam").
    patch(controller.changeTeam);
module.exports = router;