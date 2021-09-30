const mongoose = require("mongoose");
const validator = require("validator");

const Admin = mongoose.Schema({
  id: {
    type: mongoose.Types.ObjectId,
    unique: true,
    // default: new mongoose.Types.ObjectId(),
  },
  email: {
    type: String,
    required: [true, "Please enter email address."],
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },

  password: {
    type: String,
    required: [true, "Please enter password."],
    minLength: 7,
    validate(value) {
      if (value.minLength < 7) {
        throw new Error("Password must be atleast 7 charactes");
      }
    },
  },
});

module.exports = mongoose.model("Admin", Admin);
