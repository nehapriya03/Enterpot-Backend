const mongoose = require("mongoose");
const OrderStatus = require("../models/OrderModel");
const orderRepository = require("../repository/OrderRepository");
const orderModel = require("../models/OrderModel");

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

exports.getOrderById = async (req, res) => {
  let { id } = req.params;
  await orderRepository
    .getOrderById(id)
    .then((orderFound) => {
      if (orderFound === 0) {
        console.info(`No order with id: ${id} has been found.`);
        return res.status(404).send(`No order with id: ${id} has been found.`);
      }
      console.log(`Order with orderId: ${id} has been successfully found.`);
      return res.status(200).send(orderFound);
      // return res.status(200).send(`ljmkhn`);
    })
    .catch((error) => {
      console.error("There was an error.", error);
      return res.status(500).send("There was an error.");
    });
};

exports.getllOrder = async (req, res) => {
  await orderRepository
    .getAllOrders()
    .then((orderFound) => {
      if (orderFound === 0) {
        console.info(`No order has been found.`);
        return res.status(404).send(`No order has been found.`);
      }
      console.log(`Order has been successfully found.`);
      return res.status(200).send(orderFound);
      // return res.status(200).send(`ljmkhn`);
    })
    .catch((error) => {
      console.error("There was an error.", error);
      return res.status(500).send("There was an error.");
    });
};

exports.getOrdersByUserId = async (req, res) => {
  let { id } = req.params;
  await orderRepository
    .getOrdersByUserId(id)
    .then((orderFound) => {
      if (orderFound.length === 0) {
        console.info(`No order has been found.`);
        return res.status(404).send(`No order has been found.`);
      }
      console.log(`Order has been successfully found.`);
      return res.status(200).send(orderFound);
      // return res.status(200).send(`ljmkhn`);
    })
    .catch((error) => {
      console.error("There was an error.", error);
      return res.status(500).send("There was an error.");
    });
};

exports.getOrdersByOrderStatus = async (req, res) => {
  let status = req.body;
  await orderRepository
    .getOrdersByOrderStatus(status)
    .then((orderFound) => {
      if (orderFound.length === 0) {
        console.info(`No order has been found.`);
        return res.status(404).send(`No order has been found.`);
      }
      console.log(`Order has been successfully found.`);
      return res.status(200).send(orderFound);
      // return res.status(200).send(`ljmkhn`);
    })
    .catch((error) => {
      console.error("There was an error.", error);
      return res.status(500).send("There was an error.");
    });
};

exports.getOrdersBySalespersonId = async (req, res) => {
  let { id } = req.params;
  await orderRepository
    .getOrdersBySalespersonId(id)
    .then((orderFound) => {
      if (orderFound.length === 0) {
        console.info(`No order has been found.`);
        return res.status(404).send(`No order has been found.`);
      }
      console.log(`Order has been successfully found.`);
      return res.status(200).send(orderFound);
      // return res.status(200).send(`ljmkhn`);
    })
    .catch((error) => {
      console.error("There was an error.", error);
      return res.status(500).send("There was an error.");
    });
};

exports.updateOrder = async (req, res) => {
  let { id } = req.params;

  let {
    _id,
    userId,
    salesPersonId,
    productQuantityList,
    address,
    productWarehouseCountList,
    createdDate,
    status,
    paymentMode,
  } = req.body;

  if (_id !== id) {
    console.error(`Id in the body and path must be same.`);
    return res.status(400).send(`Id in the body and path must be same.`);
  }

  await orderRepository
    .getOrderByIdSimple(_id)
    .then(async (orderFound) => {
      if (orderFound === null) {
        console.info(`There is no order with id: ${_id} in the database.`);
        return res
          .status(404)
          .send(`There is no order with id: ${_id} in the database.`);
      }

      let order = new OrderStatus({
        _id,
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
        .updateOrder(order)
        .then((orderUpdated) => {
          if (orderUpdated.n === 0) {
            console.error(`Order has not been updated. `);
            return res.status(200).send(`Order has not been updated. `);
          }
          console.info(`order has been updated.`);
          return res.status(400).send(` order has been updated.`);
        })
        .catch((error) => {
          console.error(`There was an error in updating the order.`, error);
          return res
            .status(500)
            .send(`There was an error in updating the order.`);
        });
    })
    .catch((error) => {
      console.error(
        `There was an error in finding the order with id: ${id}.`,
        error
      );
      return res
        .status(500)
        .send(`There was an error in finding the order with id: ${id}.`);
    });
};
