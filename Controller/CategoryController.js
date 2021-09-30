const categoryRepository = require("../repository/CategoryRepository");
const productRepository = require("../repository/ProductRepository");
const categoryModel = require("../models/CategoryModel");

const ERROR_MESSAGE = "An internal server error occured.";

exports.addCategory = async (req, res) => {
  let { name } = req.body;
  let category = new categoryModel({ name });

  await categoryRepository
    .addCategory(category)
    .then((categoryAdded) => {
      console.info(`Category with name: ${name} has been sucessfully added.`);
      return res.status(200).send(categoryAdded);
    })
    .catch((error) => {
      console.error(`There was an error while adding the category.`, error);
      return res.status(500).send(error.message);
    });
};

exports.getCategoryById = async (req, res) => {
  let { id } = req.params;
  await categoryRepository
    .getCategoryById(id)
    .then((categoryFound) => {
      if (categoryFound.length === 0) {
        console.log(`No category with categoryId: ${id} was found.`);
        return res
          .status(404)
          .send(`No category with categoryId: ${id} was found.`);
      }
      console.log(`Category with categoryId: ${id} was sucessfully found.`);
      return res.status(200).send(categoryFound);
    })
    .catch((error) => {
      console.error(`There was an error`, error);
      return res.status(500).send(ERROR_MESSAGE);
    });
};

exports.getAllCategories = async (req, res) => {
  await categoryRepository
    .getAllCategories()
    .then((categoryFound) => {
      if (categoryFound.length === 0) {
        console.log(`No category was found.`);
        return res.status(404).send(`No category was found.`);
      }
      console.log(`Category was sucessfully found.`);
      return res.status(200).send(categoryFound);
    })
    .catch((error) => {
      console.error(`There was an error`, error);
      return res.status(500).send(ERROR_MESSAGE);
    });
};

exports.getAllCategoriesSimple = async (req, res) => {
  await categoryRepository
    .getAllCategoriesSimple()
    .then((categoryFound) => {
      if (categoryFound === 0) {
        console.info(`No category present in the database.`);
        return res.status(404).send(`No category present in the database.`);
      }
      console.info(`All category has been succesffuly found.`);
      return res.status(200).send(categoryFound);
    })
    .catch((error) => {
      console.error(`There was an error`, error);
      return res.status(500).send(ERROR_MESSAGE);
    });
};

exports.updateCategory = async (req, res) => {
  let { id: pathId } = req.params;
  let { _id, name } = req.body;

  if (pathId !== _id) {
    console.log(`Id in the path and body must be same.`);
    return res.status(400).send(`Id in the path and body must be same.`);
  }

  let category = new categoryModel({
    _id,
    name,
  });

  await categoryRepository
    .getCategoryById(pathId)
    .then(async (categoryFound) => {
      if (categoryFound.length === 0) {
        console.error(
          `No category with categoryId: ${_id} exists in the database.`
        );
        return res
          .status(404)
          .send(`No category with categoryId: ${_id} exists in the database.`);
      }

      await categoryRepository
        .updateCategoryById(category)
        .then((updatedCategory) => {
          if (updatedCategory.n === 0) {
            console.error(
              `Update Failed: No category with categoryId: ${_id} exists.`
            );
            return res
              .status(404)
              .send(
                `Update Failed: No category with categoryId: ${_id} exists.`
              );
          }
          console.info(`Category with id: ${_id} has been sucessfuly updated.`);
          return res
            .status(200)
            .json(`Category with id: ${_id} has been sucessfuly updated.`);
        });
    })
    .catch((error) => {
      console.error(`There was a server error`, error);
      return res.status(500).send(ERROR_MESSAGE);
    })

    .catch((error) => {
      console.error(
        `There was an error in fetching the category with categoryId: ${_id} from database.`,
        error
      );
      return res.status(500).send(ERROR_MESSAGE);
    });
};

exports.deleteCategoryById = async (req, res, next) => {
  try {
    let id = req.params.id;

    await categoryRepository
      .getAllCategoriesSimple(id)
      .then(async (categoryFound) => {
        if (categoryFound.length === 0) {
          console.error(`Category with categoryId: ${id} does not exists.`);
          return res
            .send(404)
            .send(`Category with categoryId: ${id} does not exists.`);
        }
        await productRepository
          .getProductCountByCategoryId(id)
          .then(async (productFound) => {
            if (productFound !== 0) {
              console.error(
                `Delete Failed! There are products that are currently using the category with id: ${id}`
              );
              res
                .status(400)
                .send(
                  `Delete Failed! There are products that are currently using the category with id: ${id}`
                );
            }

            await categoryRepository
              .deleteCategoryById(id)
              .then((categoryDeleted) => {
                if (categoryDeleted.deletedCount > 0) {
                  console.log(
                    `Category with id: ${id} has been sucessfully deleted.`
                  );
                  return res
                    .status(200)
                    .send(
                      `Category with id: ${id} has been sucessfully deleted.`
                    );
                }
                console.log(`Category with categoryId: ${id} doesn't exists..`);
                return res
                  .status(400)
                  .send(`Category with categoryId: ${id} doesn't exists..`);
              })
              .catch((error) => {
                console.error(
                  `There was an error while deleting the category with Id: ${id}`,
                  error
                );
                return res.status(500).send(ERROR_MESSAGE);
              });
          })
          .catch((error) => {
            console.error(
              `There was an error in finding the category with categoryId: ${id}`,
              error
            );
            return res.status(500).send(ERROR_MESSAGE);
          });
      })
      .catch((error) => {
        console.error(
          `There was an error in finding the category with categoryId: ${id}.`,
          error
        );
      });
  } catch (error) {
    console.error(`There was an error in deleting the category`, error);
    return res.status(500).send(ERROR_MESSAGE);
  }
};
