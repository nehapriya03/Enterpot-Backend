const express = require("express");
const router = express.Router();
const productController = require("../Controller/ProductController");
const s3Service = require("../Services/S3Service");
const multer = require("multer");

router.post("", productController.addProduct);
router.post("/upload-image", s3Service.upload, (req, res) => {
  s3Service.fileUploadToS3(req, res);
  //   productController.uploadProductImage(req, res);
  // return res.status(200).send();
});

router.delete("/delete-image", (req, res) => {
  productController.deleteProductImage(req, res);
});

// router.get("/all", productController.getAllProducts);
// router.get("/:id", productController.getProductById);
// router.get("/brand/:brandId", productController.getProductsByBrandId);
// router.get("/search", express.text, productController.getProductByNameSearch);
// router.put("/:id", productController.updateProductById);

module.exports = router;
