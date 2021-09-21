const mongoose = require("mongoose");
// const validator = require("validator");

const Warehouse = mongoose.Schema({
  id: {
    type: mongoose.Types.ObjectId,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  // List: {
  //     type:
  // }
});

module.exports = mongoose.model("Warehouse", Warehouse);
