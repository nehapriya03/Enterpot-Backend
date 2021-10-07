const mongoose = require("mongoose");
// const validator = require("validator");
// const product = require("../models/ProductModel");

exports.OrderStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
};

exports.PaymentMode = {
  CASH: "Cash",
};

const Order = mongoose.Schema({
  id: {
    type: mongoose.Types.ObjectId,
    unique: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    unique: true,
    required: [true, "Please enter userId."],
  },
  salesPersonId: {
    type: mongoose.Types.ObjectId,
    unique: true,
    required: [true, "Please enter salersPersonId."],
  },
  productQuantityList: {
    type: [],
    required: [true, "Please enter productQuantity."],
  },
  address: {
    type: String,
    required: [true, "Please enter address."],
  },

  productWarehouseCountList: {
    type: [],
    required: [true, "Please enter product warehouse count."],
  },

  createdDate: {
    type: Date,
    required: true,
    default: Date.now,
  },

  status: {
    type: String,
    required: true,
    default: this.OrderStatus.PENDING,
  },

  paymentMode: {
    type: String,
    required: true,
    default: this.PaymentMode.CASH,
  },

  totalWithoutTax: {
    type: Number,
    default: function () {
      let tempTotalWithoutTax = 0;
      for (let productQuantity of this.productQuantityList) {
        let priceWithoutTax =
          productQuantity.quantity * productQuantity.product.price;
        tempTotalWithoutTax = tempTotalWithoutTax + priceWithoutTax;
      }
      this.totalWithoutTax = tempTotalWithoutTax;
    },
  },

  totalWithTax: {
    type: Number,
    default: function () {
      let tempTotalWithTax = 0;
      for (let productQuantity of this.productQuantityList) {
        let priceWithTax =
          productQuantity.quantity * productQuantity.product.priceAfterTax;
        tempTotalWithTax = tempTotalWithTax + priceWithTax;
      }
      this.totalWithTax = tempTotalWithTax;
    },
  },
});

module.exports = mongoose.model("Order", Order);
