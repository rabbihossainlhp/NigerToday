
const express = require("express");
const renewalController = require("../../controllers/renewal.controller");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.use(auth("admin"));
router.get("/", renewalController.getAllRenewals);
router.post("/new", renewalController.createRenewal);
router.get("/customer/:customerId", renewalController.getRenewalsByCustomer);
router.route("/:renewalId")
  .get(renewalController.getRenewalById)
  .patch(renewalController.updateRenewal)
  .delete(renewalController.deleteRenewal);

module.exports = router;