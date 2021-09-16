const User = require("../models/UserModel");

exports.addUser = async (user) => {
  return await user.save();
};

exports.getAllUsers = async () => {
  return await User.find({});
};

exports.getUserById = async (id) => {
  try {
    return await User.findOne({ _id: id });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getAllUser = async () => {
  try {
    return await User.find();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getUserByBussiness = async (businessName) => {
  try {
    return await User.findOne({ businessName });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.updateUserById = async (user) => {
  try {
    return await User.updateOne({ _id: user._id }, { $set: user });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getUsersByBusinessNameRegex = async (businessName) => {
  try {
    return await User.find({
      businessName: { $regex: new RegExp(businessName), $options: "i" },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getUsersByBusinessNameIndexSearch = async (businessName) => {
  try {
    return await User.find({
      $text: { $search: businessName, $caseSensitive: false },
    }).sort({ score: { $meta: "textScore" } });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
