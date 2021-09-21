const mongoose = require("mongoose");
const validator = require("validator");

const User = mongoose.Schema({
  id: {
    type: mongoose.Types.ObjectId,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Please enter a valid email.");
      }
    },
  },

  password: {
    type: String,
    required: true,
    minLength: 7,
    validate(value) {
      if (value.minLength < 7) {
        throw new Error("Password must be atleast 7 character long.");
      }
    },
  },

  phoneNumber: {
    type: Number,
    required: true,
  },

  businessName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

User.index({
  businessName: "text",
});

module.exports = mongoose.model("User", User);
