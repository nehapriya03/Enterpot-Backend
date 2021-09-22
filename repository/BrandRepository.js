const brandModel = require("../models/BrandModel");
const productController = require("../Controller/ProductController");

exports.addBrand = async (brand) => {
  return await brandModel.save();
};

exports.getBrandById = async (id) => {
  try {
    return await brandModel.find({ _id: id });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getAllBrand = async () => {
  try {
    return await brandModel.find({});
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
