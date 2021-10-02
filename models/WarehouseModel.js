const mongoose = require("mongoose");
// const validator = require("validator");

const Warehouse = mongoose.Schema({
  id: {
    type: mongoose.Types.ObjectId,
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Please enter warehouse name."],
  },
  address: {
    type: String,
    required: [true, "Please enter warehouse address."],
  },
});

module.exports = mongoose.model("Warehouse", Warehouse);
