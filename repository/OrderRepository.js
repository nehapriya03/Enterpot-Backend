const Order = require("../models/OrderModel");
const mongoose = require("mongoose");

exports.addOrder = async (order) => {
  try {
    return await order.save();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getOrderById = async (id) => {
  try {
    await Order.aggregate([]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// exports.getAllOrders = async () => {
//   try {
//     return await Order.aggregate([
//         {
//             $lookup:
//             {

//             }
//         }
//     ]);
//   } catch (error) {}
// };
