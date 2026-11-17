const express = require('express');
const auth = require('../../middlewares/auth');
const {settingsController} = require("../../controllers")
const settingsValidation = require("../../validations/settings.validation");
const validate = require('../../middlewares/validate');

const router = express.Router();


router.route("/")
    .get(auth("admin"), settingsController.getSettings)
    .patch(auth("admin"), validate(settingsValidation.updateSettings), settingsController.updateSettings)





module.exports = router;

