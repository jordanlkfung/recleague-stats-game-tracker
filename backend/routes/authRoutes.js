const express = require('express');
const controller = require('../controllers/authController');
const router = express.Router();

router.route("/login")
    .post(controller.login);

router.route("/logout")
    .get(controller.logout);

router.route("/refresh")
    .get(controller.refresh);

module.exports = router