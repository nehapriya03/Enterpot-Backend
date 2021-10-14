const express = require("express");
const router = express.Router();

const cartController = require("../Controller/CartController");

router.post("", cartController.addCart);
router.get("/user_salesperson", cartController.getCartByUserIdAndSalespersonId);

module.exports = router;
