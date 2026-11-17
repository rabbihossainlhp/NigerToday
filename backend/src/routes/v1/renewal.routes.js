
const express = require("express");
const renewalController = require("../../controllers/renewal.controller");
const auth = require('../../middlewares/auth');



const router = express.Router();

router.get("/", renewalController.getAllRenewals);

router.route("/new").post(auth("admin"), renewalController.createRenewal )

router.route("/:customerId").get(auth("admin"), renewalController.getRenewalsByCustomer)

router.route("/:renewalId").patch(auth("admin"), renewalController.updateRenewal);

module.exports = router;