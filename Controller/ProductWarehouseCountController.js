const productWarehouseRepository = require("../repository/ProductWarehouseCountRepository");
const productWarehouseModel = require("../models/ProductWarehouseCountModel");

exports.addProductWarehouse = async (req, res) => {
  let { productId, warehouseId, productCount } = req.body;
  let productWarehouse = new productWarehouseModel({
    productId,
    warehouseId,
    productCount,
  });

  await productWarehouseRepository
    .addProductWarehouse(productWarehouse)
    .then((productWarehouseAdded) => {
      console.info("Warehouse Product has been added sucessfully.");
      return res.status(200).send(productWarehouseAdded);
    })
    .catch((error) => {
      console.error(
        `There was an error while adding the product warehouse details.`,
        error
      );
      return res
        .status(500)
        .send(`There was an error while adding the product warehouse details.`);
    });
};
