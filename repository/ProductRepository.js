const mongoose = require("mongoose");
const productModel = require("../models/ProductModel");

exports.addProduct = async (product) => {
  return await product.save();
};

exports.getProductById = async (id) => {
  try {
    return await productModel.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "brands",
          localField: "brandId",
          foreignField: "_id",
          as: "brand",
        },
      },
      {
        $set: {
          brand: { $first: "$brand" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryIdList",
          foreignField: "_id",
          as: "categoryList",
        },
      },
      {
        $lookup: {
          from: "productwarehouses",
          localField: "_id",
          foreignField: "productId",
          as: "count",
        },
      },
      {
        $set: {
          count: { $sum: "$count.productCount" },
        },
      },
    ]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getAllProducts = async () => {
  try {
    return await productModel.find({});
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getProductsByBrandId = async (brandId) => {
  try {
    return await productModel.findOne({ brandId });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getProductsByNameRegex = async (name) => {
  try {
    return await productModel.find({
      name: { $regex: new RegExp(name), $options: "i" },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getProductsByNameIndexSearch = async (name) => {
  try {
    return await productModel
      .find({
        $text: { $search: name, $caseSensitive: false },
      })
      .sort({ score: { $meta: "textScore" } });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.updateProductById = async (product) => {
  try {
    return await productModel.updateOne(
      { _id: product._id },
      { $set: product }
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getProductCountByBrandId = async (brandId) => {
  try {
    return await productModel.countDocuments({ brandId });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getProductCountByCategoryId = async (categoryId) => {
  try {
    return await productModel.countDocuments({ categoryIdList: categoryId });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
