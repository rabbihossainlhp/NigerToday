const express = require('express');
const auth = require('../../middlewares/auth');
const {customerController} = require("../../controllers")


const router = express.Router();

router.route("/create").post(auth("admin"), customerController.createCustomer);
router.route("/customers-list").get(auth("admin"), customerController.getCustomerList);
router.route("/:id")
    .get(auth("admin"), customerController.getSingleCustomer)
    .patch(auth("admin"), customerController.updateCustomer)




module.exports = router;

