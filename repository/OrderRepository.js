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
    await Order.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $set: {
          user: { $first: "$user" },
        },
      },
      {
        $lookup: {
          from: "salespeople",
          localField: "salesPersonId",
          foreignField: "_id",
          as: "salesperson",
        },
      },
      {
        $set: {
          salesperson: { $first: "$salesperson" },
        },
      },
    ]);
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
