const express = require("express");
const router = express.Router();
const brandController = require("../Controller/BrandController");

router.post("", brandController.addBrand);
// router.get("/all", brandController.getAllBrands);
router.get("/all-simple", brandController.getAllBrandsSimple);
// router.put("/:id", brandController.updateBrand);
// router.get("/:brandId", brandController.getBrandById);
router.delete("/:id", brandController.deleteBrandById);

module.exports = router;
