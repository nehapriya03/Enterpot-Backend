const productWarehouseModel = require("../models/ProductWarehouseCountModel");
const mongoose = require("mongoose");

exports.addProductWarehouse = async (productwarehouse) => {
  return await productwarehouse.save();
};

exports.getProductWarehouseCountByProductId = async (id) => {
  try {
    return await productWarehouseModel.aggregate([
      {
        $match: {
          productId: { $eq: mongoose.Types.ObjectId(id) },
          productCount: { $gt: 0 },
        },
      },
      {
        $lookup: {
          from: "warehouses",
          localField: "warehouseId",
          foreignField: "_id",
          as: "warehouse",
        },
      },
      {
        $set: {
          warehouse: { $first: "$warehouse" },
        },
      },
    ]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getProductWarehouseCountByWarehouseId = async (id) => {
  try {
    return await productWarehouseModel.aggregate([
      {
        $match: {
          warehouseId: mongoose.Types.ObjectId(id),
          productCount: { $gt: 0 },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $set: {
          warehouse: { $first: "$product" },
        },
      },
      {
        $lookup: {
          from: "brands",
          localField: "product.brandId",
          foreignField: "_id",
          as: "brand",
        },
      },
      {
        $set: {
          brand: { $first: "$brand" },
        },
      },
    ]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getProductWarehouseCountsByProductIds = async (productIds) => {
  for (let i = 0; i < productIds.length; i++) {
    productIds[i] = mongoose.Types.ObjectId(productIds[i]);
  }

  try {
    return await productWarehouseModel.aggregate([
      {
        $match: {
          productId: { $in: productIds },
          productCount: { $gt: 0 },
        },
      },
      {
        $lookup: {
          from: "warehouses",
          localField: "warehouseId",
          foreignField: "_id",
          as: "warehouse",
        },
      },
      {
        $set: {
          warehouse: { $first: "$warehouse" },
        },
      },
    ]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.upsertProductWarehouseCount = async (productWarehouseCount) => {
  let { productCount } = productWarehouseCount;
  try {
    return await productWarehouseModel.updateOne(
      {
        productId: productWarehouseCount.productId,
        warehouseId: productWarehouseCount.warehouseId,
      },
      { $set: { productCount } },
      { upsert: true }
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.updateProductCount = async (productWarehouseCount, difference) => {
  try {
    return await productWarehouseModel.updateOne(
      {
        productId: productWarehouseCount.productId,
        warehouseId: productWarehouseCount.warehouseId,
      },
      { $inc: { productCount: difference } }
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.deleteProductWarehouseCountByProductIdAndWarehouseIds = async (
  productId,
  warehouseIds
) => {
  try {
    return await productWarehouseModel.deleteMany({
      productId,
      warehouseId: { $in: warehouseIds },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
