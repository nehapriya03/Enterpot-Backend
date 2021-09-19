const SalesPerson = require("../models/SalesPersonModel");

exports.addSalesPerson = async (salesPerson) => {
  return await salesPerson.save();
};

exports.getAllSalesPerson = async () => {
  try {
    return await SalesPerson.find({});
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getSalesPersonById = async (id) => {
  try {
    return await SalesPerson.findOne({ _id: id });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getSalesPersonByEmail = async (email) => {
  try {
    return await SalesPerson.findOne({ email });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.updateSalesPerson = async (id) => {
  try {
    return await SalesPerson.updateOne({ _id: id });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
