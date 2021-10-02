const mongoose = require("mongoose");

const ProductWarehouse = mongoose.Schema({
  productId: {
    type: mongoose.Types.ObjectId,
    required: [true, "Please enter productId"],
  },

  warehouseId: {
    type: mongoose.Types.ObjectId,
    required: [true, "Please enter warehouseId"],
  },

  productCount: {
    type: Number,
    required: [true, "Please enter product count."],
  },
});

module.exports = mongoose.model("ProductWarehouse", ProductWarehouse);
