const express = require("express");
const router = express.Router();

const productWarehouseController = require("../Controller/ProductWarehouseCountController");

router.post("", productWarehouseController.addProductWarehouse);

module.exports = router;
