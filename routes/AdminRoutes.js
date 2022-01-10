const express = require("express");
const router = express.Router();
const adminController = require("../Controller/AdminController");

router.post("/signup", adminController.addAdmin);
router.post("/login", adminController.adminLogin);
router.get("/:id", adminController.getAdminById);
// router.get("/email/:email", adminController.getAdminByEmail);
// router.put("/id/:adminId", adminController.updateAdminById);

module.exports = router;
