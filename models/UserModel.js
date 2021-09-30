const mongoose = require("mongoose");
const validator = require("validator");

const User = mongoose.Schema({
  id: {
    type: mongoose.Types.ObjectId,
    unique: true,
  },
  firstName: {
    type: String,
    required: [true, "Enter first name"],
  },
  lastName: {
    type: String,
    required: [true, "Enter last name"],
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
    required: [true, "Enter phone number"],
  },

  businessName: {
    type: String,
    required: [true, "Enter business name"],
  },
  address: {
    type: String,
    required: [true, "Enter address"],
  },
});

User.index({
  businessName: "text",
});

module.exports = mongoose.model("User", User);
