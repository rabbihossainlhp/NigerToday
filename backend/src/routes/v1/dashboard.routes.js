
const express = require('express');
const auth = require('../../middlewares/auth');
const {dashboardController} = require("../../controllers")


const router = express.Router();

//for dashboard statistic....
router.route("/stats").get(auth("admin"), dashboardController.getDashboardStats);




module.exports = router;

