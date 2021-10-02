const mongoose = require("mongoose");
const validator = require("validator");
const product = require("../models/ProductModel");

export const OrderStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
};

export const PaymentMode = {
  CASH: "Cash",
};

const order = mongoose.Schema({
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
    default: OrderStatus.PENDING,
  },

  paymentMode: {
    type: String,
    default: PaymentMode.CASH,
  },

  totalWithoutTax: {
    type: Number,
    default: function () {
      for (let productQuantity of this.productQuantityList) {
        let priceWithoutTax =
          productQuantity.quantity * productQuantity.product.price;
        this.totalWithoutTax = this.totalWithoutTax + priceWithoutTax;
      }
    },
  },

  totalWithTax: {
    type: Number,
    default: function () {
      for (let productQuantity of this.productQuantityList) {
        let priceWithTax =
          productQuantity.quantity * productQuantity.product.priceAfterTax;
        this.totalWithTax = this.totalWithTax + priceWithTax;
      }
    },
  },
});
