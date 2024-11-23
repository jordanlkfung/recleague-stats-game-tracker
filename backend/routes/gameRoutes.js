const express = require('express');
const router = express.Router();
var controller = require('../controllers/gameController');

router.route("").post(controller.newGame).get(controller.getAllGames);

module.exports = router;