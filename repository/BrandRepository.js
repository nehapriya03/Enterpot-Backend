const brandModel = require("../models/BrandModel");
// const productController = require("../Controller/ProductController");
const BrandModel = require("../models/BrandModel");
const mongoose = require("mongoose");

exports.addBrand = async (brand) => {
  return await brand.save();
};

exports.getBrandById = async (brandId) => {
  try {
    return await BrandModel.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(brandId) },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "brandId",
          as: "productList",
        },
      },

      {
        $set: {
          count: { $size: "$productList" },
        },
      },
    ]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
exports.getAllBrand = async () => {
  try {
  } catch {}
};

exports.getAllBrands = async () => {
  try {
    return brandModel.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "brandId",
          as: "productList",
        },
      },
      {
        $set: {
          count: { $size: "$productList" },
        },
      },
    ]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.updateBrand = async (brand) => {
  try {
    return await brandModel.updateOne({ _id: brand.id }, { $set: brand });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.deleteBrandById = async (id) => {
  try {
    return await brandModel.deleteOne({ _id: id });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getAllBrandSimple = async () => {
  try {
    return await brandModel.find({});
  } catch (error) {
    console.error(error);
    throw error;
  }
};
