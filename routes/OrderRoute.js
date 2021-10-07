const express = require("express");
const router = express.Router();
const orderController = require("../Controller/OrderController");

router.post("", orderController.addOrder);

module.exports = router;
