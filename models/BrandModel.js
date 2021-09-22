const mongoose = require("mongoose");

const Brand = mongoose.Schema({
  id: {
    type: mongoose.Types.Schema,
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Please enter a Brand name."],
  },
});

module.exports = mongoose.model("Brand", Brand);
