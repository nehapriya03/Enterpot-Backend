const brandRepository = require("../repository/BrandRepository");
const brandModel = require("../models/BrandModel");
const productRepository = require("../repository/ProductRepository");

const ERROR_MESSAGE = "An internal server error occured.";

exports.addBrand = async (req, res) => {
  let { name } = req.body;
  let brand = new brandModel({ name });

  await brandRepository
    .addBrand(brand)
    .then((brandAdded) => {
      console.info(`Brand with name: ${name} has been sucessfully added.`);
      return res.status(200).send(brandAdded);
    })
    .catch((error) => {
      console.error(`There was an error while adding the brand.`, error);
      return res.status(500).send(ERROR_MESSAGE);
    });
};

exports.getBrandById = async (req, res) => {
  let { brandId } = req.params;
  await brandRepository
    .getBrandById(brandId)
    .then((brandFound) => {
      if (brandFound.length === 0) {
        console.error(`No brand with brnadId: ${brandId} was found.`);
        return res
          .status(404)
          .send(`No brand with brnadId: ${brandId} was found.`);
      }

      console.info(`Brand with brandId: ${brandId} was successfully found.`);
      return res.status(200).send(brandFound[0]);
    })
    .catch((error) => {
      console.error(`Some error occured`, error);
      return res.status(500).send(ERROR_MESSAGE);
    });
};

exports.getAllBrands = async (req, res) => {
  await brandRepository
    .getAllBrand()
    .then((brandFound) => {
      if (brandFound.length === 0) {
        console.info(`There is no brand present in the database.`);
        return res
          .status(404)
          .send(`There is no brand present in the database.`);
      }
      console.info(
        `All the brands has been sucessfully fetched from the database.`
      );
      return res.status(200).send(brandFound);
    })
    .catch((error) => {
      console.error(`An internal server error occured`, error);
      return res.status(500).send(ERROR_MESSAGE);
    });
};

exports.updateBrand = async (req, res) => {
  let { id: pathId } = req.params;
  let { _id, name } = req.body;

  if (pathId !== _id) {
    console.log(`Id in the path and body must be same.`);
    return res.status(400).send(`Id in the path and body must be same.`);
  }

  let brand = new brandModel({
    _id,
    name,
  });

  await brandRepository
    .getBrandById(pathId)
    .then(async (bradFound) => {
      if (bradFound === null) {
        console.error(`No brand with brandId: ${_id} exists in the database.`);
        return res
          .status(404)
          .send(`No brand with brandId: ${_id} exists in the database.`);
      }

      await brandRepository.updateBrand(brand).then((updatedBrand) => {
        if (updatedBrand.n === 0) {
          console.error(`Update Failed: No brand with brandId: ${_id} exists.`);
          return res
            .status(404)
            .send(`Update Failed: No brand with brandId: ${_id} exists.`);
        }
        console.info(`Brand with id: ${_id} has been sucessfuly updated.`);
        return res
          .status(200)
          .json(`Brand with id: ${_id} has been sucessfuly updated.`);
      });
    })
    .catch((error) => {
      console.error(`There was a server error`, error);
      return res.status(500).send(ERROR_MESSAGE);
    })

    .catch((error) => {
      console.error(
        `There was an error in fetching the barnd with brabdId: ${_id} from database.`,
        error
      );
      return res.status(500).send(ERROR_MESSAGE);
    });
};

exports.getAllBrandsSimple = async (req, res) => {
  await brandRepository
    .getAllBrandSimple()
    .then((brandFound) => {
      if (brandFound === 0) {
        console.info(`No brand present in the database.`);
        return res.status(404).send(`No brand present in the database.`);
      }
      console.info(`All brand has been succesffuly found.`);
      return res.status(200).send(brandFound);
    })
    .catch((error) => {
      console.error(`There was an error`, error);
      return res.status(500).send(ERROR_MESSAGE);
    });
};

exports.deleteBrandById = async (req, res, next) => {
  try {
    let id = req.params.id;

    await brandRepository
      .getAllBrandSimple(id)
      .then(async (brandFound) => {
        if (brandFound === null) {
          console.error(`Brand with doctorId: ${id} does not exists.`);
          return res
            .send(404)
            .send(`Brand with doctorId: ${id} does not exists.`);
        }
        await productRepository
          .getProductCountByBrandId(id)
          .then(async (productFound) => {
            if (productFound !== 0) {
              console.error(
                `Delete Failed! There are products that are currently using the brand with id: ${id}`
              );
              res
                .status(200)
                .send(
                  `Delete Failed! There are products that are currently using the brand with id: ${id}`
                );
            }

            await brandRepository
              .deleteBrandById(id)
              .then((brandDeleted) => {
                if (brandDeleted.deletedCount > 0) {
                  console.log(
                    `Brand with id: ${id} has been sucessfully deleted.`
                  );
                  return res
                    .status(200)
                    .send(`Brand with id: ${id} has been sucessfully deleted.`);
                }
              })
              .catch((error) => {
                console.error(
                  `There was an error while deleting the brad with Id: ${id}`,
                  error
                );
                return res.status(500).send(ERROR_MESSAGE);
              });
          })
          .catch((error) => {
            console.error(
              `There was an error in finding the product with brandId: ${id}`,
              error
            );
            return res.status(500).send(ERROR_MESSAGE);
          });
      })
      .catch((error) => {
        console.error(
          `There was an error in finding the brand with brandId: ${id}.`,
          error
        );
      });
  } catch (error) {
    console.error(`There was an error in deleting the brand`, error);
    return res.status(500).send(ERROR_MESSAGE);
  }
};
