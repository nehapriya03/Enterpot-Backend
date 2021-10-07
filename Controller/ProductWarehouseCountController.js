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

exports.getProductWarehouseCountsByProductId = async (req, res) => {
  let { id } = req.params;
  await productWarehouseRepository
    .getProductWarehouseCountByProductId(id)
    .then((results) => {
      if (results.length === 0) {
        console.info(
          `There is no product warehouse data present with productId: ${id}.`
        );
        return res
          .status(404)
          .send(
            `There is no product warehouse data present with productId: ${id}.`
          );
      }
      console.info(
        `"Fetching productWarehouseCount for product with ID: ${id} where count is greater than 0.`
      );
      return res.status(200).send(results);
    });
};

exports.getProductWarehouseCountByWarehouseId = async (req, res) => {
  let { id } = req.params;
  await productWarehouseRepository
    .getProductWarehouseCountByWarehouseId(id)
    .then((results) => {
      if (results.length === 0) {
        console.info(
          `There is no product warehouse data present with warehouseId: ${id}.`
        );
        return res
          .status(404)
          .send(
            `There is no product warehouse data present with warehouseId: ${id}.`
          );
      }
      console.info(
        `"Fetching productWarehouseCount for warehouseId: ${id} where count is greater than 0.`
      );
      return res.status(200).send(results);
    });
};

exports.getProductWarehouseCountsByProductIds = async (req, res) => {
  let productIds = req.body;
  await productWarehouseRepository
    .getProductWarehouseCountsByProductIds(productIds)
    .then((results) => {
      if (results.length === 0) {
        console.error(`There is no product warehouse info in database.`);
        return res
          .status(404)
          .send(`There is no product warehouse info in database.`);
      }
      console.info(
        `Product warehouse data found with productIds: ${productIds}`
      );
      return res.status(200).send(results);
    })
    .catch((error) => {
      console.error(`There was some occured.`, error);
      return res.status(500).send(`There was sone occured.`);
    });
};

exports.upsertProductWarehouseCount = async (req, res) => {
  let { productId, warehouseId, productCount } = req.body;
  let productWarehouse = new productWarehouseModel({
    productId,
    warehouseId,
    productCount,
  });

  await productWarehouseRepository
    .upsertProductWarehouseCount(productWarehouse)
    .then((results) => {
      if (results === 0) {
        console.info(`Product warehoue data was not found in the database.`);
        return res
          .status(404)
          .send(`Product warehoue data was not found in the database.`);
      }
      console.info(
        `Product warehoue data was successfully updated in the database.`
      );
      return res.status(200).send(results);
    })
    .catch((error) => {
      console.error(`There was some error.`, error);
      return res.status(500).send(`There was some error.`);
    });
};

exports.updateProductCount = async (req, res) => {
  let { productId, warehouseId, productCount, difference } = req.body;
  let productWarehouse = new productWarehouseModel({
    productId,
    warehouseId,
    productCount,
  });

  await productWarehouseRepository
    .updateProductCount(productWarehouse, difference)
    .then((results) => {
      if (results.n === 0) {
        console.info(`No document found in the database.`);
        return res.status(404).send(`No document found in the database.`);
      }
      console.info(`Product count has been updated`);
      return res.status(200).send(`Product count has been updated.`);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send(error);
    });
};

exports.deleteProductWarehouseCount = async (req, res) => {
  let { productId, warehouseId } = req.body;

  await productWarehouseRepository
    .deleteProductWarehouseCountByProductIdAndWarehouseIds(
      productId,
      warehouseId
    )
    .then((results) => {
      if (results.deletedCount > 1) {
        console.info(`Product warehouse has been sucessfully deleted.`);
        return res
          .status(200)
          .send(`Product warehouse has been sucessfully deleted.`);
      }
      console.error(`There was an error.`);
      return res.status(400).send(`There was an error`);
    })
    .catch((error) => {
      console.error(`There was an error`, error);
      return res.status(500).send(`There was an error.`);
    });
};
