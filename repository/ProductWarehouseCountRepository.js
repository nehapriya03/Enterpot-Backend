const productWarehouseModel = require("../models/ProductWarehouseCountModel");

exports.addProductWarehouse = async (productwarehouse) => {
  return await productwarehouse.save();
};
