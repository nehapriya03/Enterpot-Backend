const express = require("express");
const router = express.Router();
const productController = require("../Controller/ProductController");

router.post("", productController.addProduct);
router.get("/all", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.get("/brand/:brandId", productController.getProductByBrandId);
router.get("/search", express.text, productController.getProductByNameSearch);
router.put("/:id", productController.updateProductById);
router.post("/upload-image", productController.uploadProductImage);
router.delete("/delete-image", productController.deleteProductImage);
