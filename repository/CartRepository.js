const cartModel = require("../models/CartModel");

exports.addCart = async (cart) => {
  try {
    return await cart.save();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getCartBySalespersonId = async (id) => {
  try {
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getCartByUserIdAndSalespersonId = async (userId, salespersonId) => {
  try {
    return await cartModel.findOne({ userId, salespersonId });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.upsertCart = async (cart) => {
  try {
    return await cartModel.updateOne(
      { _id: cart._id },
      { $set: cart },
      { upsert: true }
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.deleteCart = async (userId, salespersonId) => {
  try {
    return await cartModel.deleteOne({ userId, salespersonId });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
