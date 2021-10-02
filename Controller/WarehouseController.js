const warehouseRepository = require("../repository/WarehouseRepository");
const warehouseModel = require("../models/WarehouseModel");

const ERROR_MESSAGE = "An internal server error.";

exports.addWarehouse = async (req, res) => {
  let { name, address } = req.body;

  let warehouse = new warehouseModel({
    name,
    address,
  });

  await warehouseRepository
    .addWarehouse(warehouse)
    .then((warehouseAdded) => {
      console.log(`Warehouse with name ${name} has been sucessfully added.`);
      return res.status(200).send(warehouseAdded);
    })
    .catch((error) => {
      console.error(`There was an error while adding the warehouse.`, error);
      return res.status(500).send(error.message);
    });
};

exports.getWarehouseById = async (req, res) => {
  let { id } = req.params;
  await warehouseRepository
    .getAllWarehouseById(id)
    .then((warehouseFound) => {
      if (warehouseFound.length === 0) {
        console.info(`No warehouse with warehouseId: ${id} has been found.`);
        return res
          .status(404)
          .send(`No warehouse with warehouseId: ${id} has been found.`);
      }
      console.info(
        `Warehouse with warehouseId: ${id} has been successfully found.`
      );
      return res.status(200).send(warehouseFound);
    })
    .catch((error) => {
      console.error("There was an error in finding the warehouse.", error);
      return res.status(500).send(ERROR_MESSAGE);
    });
};

exports.getAllWarehouse = async (req, res) => {
  await warehouseRepository
    .getAllWarehouse()
    .then((warehouseFound) => {
      if (warehouseFound.length === 0) {
        console.info(`No warehouse has been found.`);
        return res.status(404).send(`No warehouse has been found.`);
      }
      console.info(`Warehouse has been successfully found.`);
      return res.status(200).send(warehouseFound);
    })
    .catch((error) => {
      console.error("There was an error in finding the warehouse.", error);
      return res.status(500).send(ERROR_MESSAGE);
    });
};

exports.getAllWarehouseSimple = async (req, res) => {
  await warehouseRepository
    .getAllWarehouseSimple()
    .then((warehouseFound) => {
      if (warehouseFound === 0) {
        console.error(`No warehouse is found in the database.`);
        return res.status(404).send(`No warehouse is found in the database.`);
      }
      console.info(`All warehouse has been successfully found.`);
      return res.status(200).send(warehouseFound);
    })
    .catch((error) => {
      console.error(`There was an error.`, error);
      return res.status(500).send(ERROR_MESSAGE);
    });
};

exports.updateWarehouseById = async (req, res) => {
  let { id: pathId } = req.params;
  let { _id, name, address } = req.body;

  if (pathId !== _id) {
    console.log(`Id in the path and body must be same.`);
    return res.status(400).send(`Id in the path and body must be same.`);
  }

  let warehouse = new warehouseModel({
    _id,
    name,
    address,
  });

  await warehouseRepository
    .getAllWarehouseById(pathId)
    .then(async (warehouseFound) => {
      if (warehouseFound.length === 0) {
        console.error(
          `No warehouse with warehouseId: ${_id} exists in the database.`
        );
        return res
          .status(404)
          .send(
            `No warehouse with warehouseId: ${_id} exists in the database.`
          );
      }

      await warehouseRepository
        .updateWarehouse(warehouse)
        .then((updateWarehouse) => {
          if (updateWarehouse.n === 0) {
            console.error(
              `Update Failed: No warehouse with warehouseId: ${_id} exists.`
            );
            return res
              .status(404)
              .send(
                `Update Failed: No warehouse with warehouseId: ${_id} exists.`
              );
          }
          console.info(
            `Warehouse with id: ${_id} has been sucessfuly updated.`
          );
          return res
            .status(200)
            .json(`Warehouse with id: ${_id} has been sucessfuly updated.`);
        });
    })
    .catch((error) => {
      console.error(`There was a server error`, error);
      return res.status(500).send(ERROR_MESSAGE);
    })

    .catch((error) => {
      console.error(
        `There was an error in fetching the warehouse with warehouseId: ${_id} from database.`,
        error
      );
      return res.status(500).send(ERROR_MESSAGE);
    });
};
