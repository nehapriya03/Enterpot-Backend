const express = require("express");
const router = express.Router();
const categoryController = require("../Controller/CategoryController");

router.post("", categoryController.addCategory);
router.get("/all", categoryController.getAllCategories);
router.get("/all-simple", categoryController.getAllCategoriesSimple);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategoryById);
// router.get("/:id", categoryController.getCategoryById);

module.exports = router;
