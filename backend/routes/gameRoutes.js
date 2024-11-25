const express = require('express');
const router = express.Router();
var controller = require('../controllers/gameController');

router.route("")
    .post(controller.newGame)
    .get(controller.getAllGames);

router.route("/:_id")
    .get(controller.getGame)
    .delete(controller.deleteGame);

router.route("/:_id/modifyDate").
    patch(controller.modifyDate);

router.route("/:_id/changeTeam").
    patch(controller.changeTeam);

router.route("/:_id/modifyScore").
    patch(controller.modifyScore);

router.route("/:_id/setResult").
    patch(controller.setResult);

router.route("/:_id/updateStat").
    patch(controller.updateStats);
module.exports = router;