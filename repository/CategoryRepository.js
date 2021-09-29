const categoryModel = require("../models/CategoryModel");
const mongoose = require("mongoose");

exports.addCategory = async (category) => {
  return await category.save();
};

exports.getCategoryById = async (categoryId) => {
  try {
    return await categoryModel.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(categoryId) },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "categoryIdList",
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

exports.getAllCategorie = async () => {
  try {
    return await categoryModel.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "categoryIdList",
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

exports.getAllCategoriesSimple = async () => {
  try {
    return await categoryModel.find({});
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.updateCategoryById = async (category) => {
  try {
    console.log(category.id);
    return await categoryModel.updateOne(
      { _id: category._id },
      { $set: category }
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.deleteCategoryById = async (id) => {
  try {
    return await categoryModel.deleteOne({ _id: id });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
