const ProductModel = require("../models/ProductModel");

exports.addProduct = async (product) => {
  return await ProductModel.save();
};

exports.getProductById = async (id) => {
  try {
    return await ProductModel.findOne({ _id: id });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getAllProducts = async () => {
  try {
    return await ProductModel.find({});
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getProductsByBrandId = async (brandId) => {
  try {
    return await ProductModel.findOne({ brandId });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getProductsByNameRegex = async (name) => {
  try {
    return await ProductModel.find({
      name: { $regex: new RegExp(name), $options: "i" },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getProductsByNameIndexSearch = async (name) => {
  try {
    return await ProductModel.find({
      $text: { $search: name, $caseSensitive: false },
    }).sort({ score: { $meta: "textScore" } });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.updateProductById = async (product) => {
  try {
    return await ProductModel.updateOne(
      { _id: product._id },
      { $set: product }
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//TODO - upload ProductImage
//TODO- delete ProductImage.
//TODO - getProductsCountByBrandId
//TODO - getProductCountByCategoryId
