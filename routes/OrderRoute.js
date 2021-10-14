const express = require("express");
const router = express.Router();
const orderController = require("../Controller/OrderController");

router.post("", orderController.addOrder);
router.get("/:id", orderController.getOrderById);
router.get("/all", orderController.getllOrder);
router.get("/user/:id", orderController.getOrdersByUserId);
router.get("/status", express.text(), orderController.getOrdersByOrderStatus);
router.get("/salesperson/:id", orderController.getOrdersBySalespersonId);
router.put("/:id", orderController.updateOrder);

module.exports = router;
