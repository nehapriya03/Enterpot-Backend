const mongoose = require("mongoose");
const validator = require("validator");

const SalesPerson = mongoose.Schema({
  id: {
    type: mongoose.Types.ObjectId,
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Enter name"],
  },
  email: {
    type: String,
    required: true,
    validator(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Please enter a valid Email.");
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
    required: [true, "enter phone number"],
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  addedDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Salesperson", SalesPerson);
