const mongoose = require("mongoose");

const Category = mongoose.Schema({
  id: {
    type: mongoose.Types.ObjectId,
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Please enter a Category name."],
  },
});

module.exports = mongoose.model("Category", Category);
