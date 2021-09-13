const Admin = require("../models/AdminModel");

exports.addAdmin = async (admin) => {
  return await admin.save();
};

exports.getAdminByEmail = async (email) => {
  try {
    return await Admin.findOne({ email });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getAdminById = async (id) => {
  try {
    return await Admin.findOne({ _id: id });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.updateAdminById = async (admin) => {
  try {
    let { password } = admin;
    return await Admin.updateOne({ _id: admin.id }, { $set: { password } });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
