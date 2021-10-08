const mongoose = require("mongoose");
const OrderStatus = require("../models/OrderModel");
const orderRepository = require("../repository/OrderRepository");

exports.addOrder = async (req, res) => {
  let {
    userId,
    salesPersonId,
    productQuantityList,
    address,
    productWarehouseCountList,
    createdDate,
    status,
    paymentMode,
  } = req.body;

  for (let productQuantity of productQuantityList) {
    productQuantity.product._id = mongoose.Types.ObjectId(
      productQuantity.product._id
    );
    productQuantity.product.brandId = mongoose.Types.ObjectId(
      productQuantity.product.brandId
    );
  }

  for (let productWarehouseCount of productWarehouseCountList) {
    productWarehouseCount.productId = mongoose.Types.ObjectId(
      productWarehouseCount.productId
    );
    productWarehouseCount.warehouseId = mongoose.Types.ObjectId(
      productWarehouseCount.warehouseId
    );
  }

  for (let productQuantity of productQuantityList) {
    for (let i = 0; i < productQuantity.product.categoryIdList.length; i++) {
      productQuantity.product.categoryIdList[i] = mongoose.Types.ObjectId(
        productQuantity.product.categoryIdList[i]
      );
    }
  }

  let order = new OrderStatus({
    userId,
    salesPersonId,
    productQuantityList,
    address,
    productWarehouseCountList,
    createdDate,
    status,
    paymentMode,
  });
  await orderRepository
    .addOrder(order)
    .then((orderAdded) => {
      console.info(`Order has been sucessfully added.`);
      return res.status(200).send(orderAdded);
    })
    .catch((error) => {
      console.error(`There was an error while adding the order`, error);
      return res.status(500).send(`There was an error while adding the order`);
    });
};
