const express = require("express");
const router = express.Router();
const warehouseController = require("../Controller/WarehouseController");

// router.post("", warehouseController.addWarehouse);
// router.get("/all", warehouseController.getAllWarehouse);
// router.get("/all-simple", warehouseController.getAllWarehouseSimple);
router.put("/:id", warehouseController.updateWarehouseById);
// router.get("/:id", warehouseController.getWarehouseById);

module.exports = router;
