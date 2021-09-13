const mongoose = require("mongoose");
const validator = require("validator");

const Admin = mongoose.Schema({
  adminId: {
    type: mongoose.Types.ObjectId,
    requied: true,
    unique: true,
    // default: new mongoose.ObjectId(),
  },
  email: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },

  password: {
    type: String,
    required: true,
    minLength: 7,
    validate(value) {
      if (value.minLength < 7) {
        throw new Error("Password must be atleast 7 charactes");
      }
    },
  },
});

module.exports = mongoose.model("Admin", Admin);
