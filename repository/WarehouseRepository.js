const mongoose = require("mongoose");

const warehouseModel = require("../models/WarehouseModel");

exports.addWarehouse = async (warehouse) => {
  return await warehouse.save();
};

exports.getWarehouseByIdSimple = async (id) => {
  try {
    return await warehouseModel.findOne({ id });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getAllWarehouseSimple = async () => {
  try {
    return await warehouseModel.find({});
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getAllWarehouseById = async (warehouseId) => {
  try {
    return await warehouseModel.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(warehouseId) },
      },
      {
        $lookup: {
          from: "productwarehouses",
          localField: "_id",
          foreignField: "warehouseId",
          as: "productWarehouseData",
        },
      },
      {
        $addFields: {
          totalItem: { $sum: "$productWarehouseData.productCount" },
        },
      },
    ]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getAllWarehouse = async () => {
  try {
    return await warehouseModel.aggregate([
      {
        $lookup: {
          from: "productwarehouses",
          localField: "_id",
          foreignField: "warehouseId",
          as: "productWarehouseData",
        },
      },
      {
        $addFields: {
          totalItem: { $sum: "$productWarehouseData.productCount" },
        },
      },
    ]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.updateWarehouse = async (warehouse) => {
  try {
    return await warehouseModel.updateOne(
      { _id: warehouse._id },
      { $set: warehouse }
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};
