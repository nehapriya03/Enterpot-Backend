const express = require("express");
const router = express.Router();
const userController = require("../Controller/UserController");

router.post("/signup", userController.addUser);
router.post(
  "/search",
  express.text(),
  userController.getUsersByBusinessNameSearch
);
router.put("/:id", userController.updateUserById);
// router.get("/all", userController.getAllUsers);
// router.get("/:id", userController.getUserById);
// router.get("/email/:email", userController.getUserByEmail);

module.exports = router;
