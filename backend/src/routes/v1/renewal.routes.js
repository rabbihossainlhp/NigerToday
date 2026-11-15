
const express = require("express");
const renewalController = require("../../controllers/renewal.controller");

const router = express.Router();

router.post("/", renewalController.createRenewal);

router.get("/", renewalController.getAllRenewals);

router.get(
  "/customer/:customerId",
  renewalController.getRenewalsByCustomer
);

module.exports = router;