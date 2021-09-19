const express = require("express");
const router = express.Router();
const salesPersonController = require("../Controller/SalesPersonController");

router.post("/signup", salesPersonController.addUser);
router.get("/all", salesPersonController.getAllSalesPersons);
router.get("/email/:email", salesPersonController.getSalespersonByEmail);
router.get("/:id", salesPersonController.getAllSalesPersonById);

module.exports = router;
