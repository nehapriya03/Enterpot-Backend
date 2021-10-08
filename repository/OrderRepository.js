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
    return await Order.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(id),
        },
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
          user: {
            $first: "$user",
          },
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
          salesperson: {
            $first: "$salesperson",
          },
        },
      },
    ]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getAllOrders = async () => {
  try {
    return await Order.aggregate([
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

exports.getOrdersByUserId = async (id) => {
  try {
    return await Order.findOne({ userId: id }).sort({ createdDate: -1 });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getOrdersByOrderStatus = async (status) => {
  try {
    return await Order.aggregate([
      {
        $match: { status: status },
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
        $sort: {
          createdDate: -1,
        },
      },
    ]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getOrdersBySalespersonId = async (id) => {
  try {
    return await Order.aggregate([
      {
        $match: { salesPersonId: mongoose.Types.ObjectId(id) },
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
        $set: { user: { $first: "$user" } },
      },
      {
        $sort: {
          createdDate: -1,
        },
      },
    ]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.updateOrder = async (order) => {
  try {
    return await Order.updateOne({ _id: order._id }, { $set: order });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getOrderByIdSimple = async (id) => {
  try {
    return await Order.findOne({ _id: id });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
