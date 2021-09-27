const express = require("express");
const router = express.Router();
const brandController = require("../Controller/BrandController");

// router.post("", brandController.addBrand);
router.get("/all", brandController.getAllBrands);
// router.get("/:brandId", brandController.getBrandById);

module.exports = router;
