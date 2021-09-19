const mongoose = require("mongoose");
const validator = require("validator");

const SalesPerson = mongoose.Schema({
  id: {
    type: mongoose.Types.ObjectId,
    unique: true,
  },
  name: {
    type: String,
    required: true,
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
  },
  phoneNumber: {
    type: Number,
    required: true,
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
