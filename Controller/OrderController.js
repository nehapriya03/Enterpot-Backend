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
    // totalWithoutTax,
    // totalWithTax,
  } = req.body;

  for (let productQuantity of productQuantityList) {
    productQuantity.product._id = mongoose.Types.ObjectId(
      productQuantity.product._id
    );
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
    // totalWithoutTax,
    // totalWithTax,
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
