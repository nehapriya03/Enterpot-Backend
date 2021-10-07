const express = require("express");
const router = express.Router();

const productWarehouseController = require("../Controller/ProductWarehouseCountController");

router.post("", productWarehouseController.addProductWarehouse);
// router.get(
//   "/:id",
//   productWarehouseController.getProductWarehouseCountsByProductId
// );
// router.get(
//   "/:id",
//   productWarehouseController.getProductWarehouseCountByWarehouseId
// );
// router.post(
//   "/products",
//   productWarehouseController.getProductWarehouseCountsByProductIds
// );

// router.post(
//   "/upsert-list",
//   productWarehouseController.upsertProductWarehouseCount
// );

// router.post("/update", productWarehouseController.updateProductCount);

router.post("/delete", productWarehouseController.deleteProductWarehouseCount);
module.exports = router;
