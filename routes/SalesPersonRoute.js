const express = require("express");
const router = express.Router();
const salesPersonController = require("../Controller/SalesPersonController");

// router.post("/signup", salesPersonController.addUser);
// router.get("/all", salesPersonController.getAllSalesPersons);
router.post("/login", salesPersonController.salespersonLogin);
// router.get("/email/:email", salesPersonController.getSalespersonByEmail);
// router.put("/:id", salesPersonController.updateSalespersonById);
// router.get("/:id", salesPersonController.getAllSalesPersonById);

module.exports = router;
