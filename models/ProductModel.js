// const mongoose = require("mongoose");
// const validator = require("validator");
// const mongooseDouble = require("mongoose-double");

var mongoose = require("mongoose");
require("mongoose-double")(mongoose);

const doubleTypes = mongoose.Schema.Types;

const Product = mongoose.Schema({
  id: {
    type: mongoose.Types.ObjectId,
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Please enter a name."],
  },
  metric: {
    type: String,
    required: [true, "Please enter a metric"],
  },
  price: {
    type: doubleTypes.Double,
    required: true,
    validate(value) {
      if (value <= 0) {
        throw new Error("Please enter a valid price.");
      }
    },
  },
  brandId: {
    type: mongoose.Types.ObjectId,
    required: [true, "Please enter a brand Id."],
    unique: true,
  },
  categoryIdList: {
    type: [mongoose.Types.ObjectId],
    required: [true, "Please enter the list of category ID's."],
  },

  pictures: {
    type: [String],
    required: [true, "Please enter atleast one image for the product."],
  },

  gst: {
    type: doubleTypes.Double,
    default: 18,
  },

  priceAfterTax: {
    type: doubleTypes.Double,
    default: function () {
      this.priceAfterTax = this.price * (10 + this.gstSlab / 100);
    },
  },
});

module.exports = mongoose.model("Product", Product);
