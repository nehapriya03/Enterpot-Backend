const mongoose = require("mongoose");

const Cart = mongoose.Schema({
  id: {
    type: mongoose.Types.ObjectId,
    unique: true,
  },

  userId: {
    type: mongoose.Types.ObjectId,
    required: [true, "Please enter userId."],
  },
  salespersonId: {
    type: mongoose.Types.ObjectId,
    required: [true, "Please enter salesPersonId."],
  },
  order: {
    type: {},
    required: [true, "Please enter order detail."],
  },

  lastModifiedDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Cart", Cart);
