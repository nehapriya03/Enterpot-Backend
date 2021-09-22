const express = require("express");
const router = express.Router();
const productController = require("../Controller/ProductController");
const multer = require("multer");
const s3Service = require("../Services/S3Service");

router.post("", productController.addProduct);
router.post("/upload", s3Service.upload, (req, res) => {
  s3Service.fileUploadToS3(req, res);
  // return res.status(200).send();
});

// router.get("/all", productController.getAllProducts);
// router.get("/:id", productController.getProductById);
// router.get("/brand/:brandId", productController.getProductByBrandId);
// router.get("/search", express.text, productController.getProductByNameSearch);
// router.put("/:id", productController.updateProductById);
// router.post("/upload-image", productController.uploadProductImage);
// router.delete("/delete-image", productController.deleteProductImage);

module.exports = router;
