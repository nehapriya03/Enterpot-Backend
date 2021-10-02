const productRepository = require("../repository/ProductRepository");
const ProductModel = require("../models/ProductModel");
const s3ServiceLayer = require("../Services/S3Service");

const ERROR_MESSAGE = "An Internal Server Error";

exports.addProduct = async (req, res) => {
  let {
    name,
    metric,
    price,
    brandId,
    categoryIdList,
    pictures,
    gst,
    priceAfterTax,
  } = req.body;

  let product = new ProductModel({
    name,
    metric,
    price,
    brandId,
    categoryIdList,
    pictures,
    gst,
    priceAfterTax,
  });

  await productRepository
    .addProduct(product)
    .then((addedProduct) => {
      console.info(`Product with name ${name} has been sucessfully added.`);
      return res.status(200).json(addedProduct);
    })
    .catch((error) => {
      console.error(
        `There was an error while adding the product to the database.`,
        error
      );
      return res.status(500).send(error.message);
    });
};

exports.getProductById = async (req, res) => {
  let { id } = req.params;
  await productRepository
    .getProductById(id)
    .then((productFound) => {
      if (productFound.length === 0) {
        console.error(`No product with Id: ${id} has been found.`);
        return res.staus(404).send(`No product with Id: ${id} has been found.`);
      }

      console.info(`Product with id: ${id} has been sucessfully found.`);
      return res.status(200).json(productFound);
    })
    .catch((error) => {
      console.error(`There was some error in finding the product.`, error);
      return res.status(500).send(ERROR_MESSAGE);
    });
};

exports.getAllProducts = async (req, res) => {
  await productRepository
    .getAllProducts()
    .then((productsFound) => {
      if (productsFound === null) {
        console.error(`No product has been found in database.`);
        return res.status(404).json(productsFound);
      }

      console.log(
        `All produts has been sucessfully fetched from the database.`
      );
      return res.status(200).json(productsFound);
    })
    .catch((error) => {
      console.error(`There was some error in finding the salesperson.`, error);
      return res.staus(500).send(ERROR_MESSAGE);
    });
};

exports.getProductsByBrandId = async (req, res) => {
  const { brandId } = req.params;
  await productRepository
    .getProductsByBrandId(brandId)
    .then((productFound) => {
      if (productFound === null) {
        console.error(`No product with brandId: ${brandId} was found.`);
        return res
          .status(404)
          .send(`No product with brandId: ${brandId} was found.`);
      }
      console.log(`Product with brandId: ${brandId} was sucessfully found.`);
      return res.status(200).json(productFound);
    })
    .catch((error) => {
      console.error(
        `There was an error in finding the product with brandId: ${brandId}.`,
        error
      );
      return res.status(500).send(ERROR_MESSAGE);
    });
};

const getProductsByNameRegex = async (req, res) => {
  await productRepository
    .getProductsByNameRegex(req.body)
    .then((productNameFound) => {
      if (productNameFound.length !== 0) {
        console.info(`Product with regex : ${req.body} was sucessfully found`);
        return res.status(200).send(productNameFound);
      }
      console.log(`Product with regex : ${req.body} was not found`);
      return res
        .status(404)
        .send(`Product with regex : ${req.body} was not found`);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send(ERROR_MESSAGE);
    });
};

const getProductsByNameIndexSearch = async (req, res) => {
  await productRepository
    .getProductsByNameIndexSearch(req.body)
    .then((nameFoundByIndex) => {
      if (nameFoundByIndex.length !== 0) {
        console.info(
          `Indexed search with name : ${req.body} was sucessfully executed.`
        );
        return res.status(200).send(nameFoundByIndex);
      }
      console.info(
        `Indexed search with name: ${req.body} was not found in database.`
      );
      return res
        .status(404)
        .send(
          `Indexed search with name: ${req.body} was not found in database.`
        );
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send(ERROR_MESSAGE);
    });
};

exports.getProductByNameSearch = async (req, res) => {
  switch (req.query.type) {
    case "R":
      return await getProductsByNameRegex(req, res);
    case "I":
      return await getProductsByNameIndexSearch(req, res);
    default:
      console.error(res.status(404).send(`Please enter correct query type.`));
  }
};

exports.updateProductById = async (req, res) => {
  let { id: pathId } = req.params;
  let {
    _id,
    name,
    metric,
    price,
    brandId,
    categoryIdList,
    pictures,
    gst,
    priceAfterTax,
  } = req.body;

  if (pathId !== _id) {
    console.log(`Id in the path and body must be same.`);
    return res.status(400).send(`Id in the path and body must be same.`);
  }

  let product = new ProductModel({
    _id,
    name,
    metric,
    price,
    brandId,
    categoryIdList,
    pictures,
    gst,
    priceAfterTax,
  });

  await productRepository.getProductById(_id).then(async (foundProduct) => {
    if (foundProduct === null) {
      console.warn(`product with id ${_id} does not exists in the database.`);
      return res
        .status(404)
        .send(`product with id ${_id} does not exists in the database.`);
    }

    await productRepository
      .updateProductById(product)
      .then((updatedProduct) => {
        if (updatedProduct.n === 0) {
          console.error(
            `Update Failed: product with Id: ${_id} does not exists`
          );
          return res
            .status(400)
            .send(`Update Failed: product with id: ${_id} does not exists`);
        }
        console.info(`product with id: ${_id} has been sucessfuly updated.`);
        return res
          .status(200)
          .json(`product with id: ${_id} has been sucessfuly updated.`);
      })
      .catch((error) => {
        console.error(`There was a server error`, error);
        return res.status(500).send(ERROR_MESSAGE);
      });
  });
};

exports.uploadProductImage = async (req, res) => {
  try {
    s3ServiceLayer
      .fileUploadToS3(req, res)
      .then((results) => {
        console.info(`Upload image to s3 bucket was sucessfull.`);
        return res
          .status(200)
          .send(`Upload image to s3 bucket was sucessfull.`);
      })
      .catch((error) => {
        console.error(`There was an error while uploading the picture`, error);
        return res
          .status(400)
          .send(`There was an error while uploading the picture`);
      });
  } catch (error) {
    console.error(`There was an error while uploading the image.`, error);
    return res.send(500).send(ERROR_MESSAGE);
  }
};

exports.deleteProductImage = async (req, res) => {
  var { url } = req.query;
  var objectName = url.replace(
    "https://enterpotproductimage.s3.us-east-2.amazonaws.com//",
    ""
  );
  var objectKeyPath = `/${objectName}`;
  try {
    exports.params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${objectKeyPath}`,
    };
    s3ServiceLayer.deleteImageFromS3(req, res);
  } catch (error) {
    console.error(`There was an error while deleting the image.`, error);
    return res.send(500).send(ERROR_MESSAGE);
  }
};

exports.getProductsCountsByBrandId = async (req, res) => {
  let { brandId } = req.params;
  await productRepository
    .getProductCountByBrandId(brandId)
    .then((results) => {
      if (results === 0) {
        console.log(
          `There is no document present in database with brandId : ${brandId}.`
        );
        return res
          .send(404)
          .send(
            `There is no document present in database with brandId : ${brandId}.`
          );
      }
      console.info(
        `There are ${results} documents present in the database with brandId: ${brandId}.`
      );
      return res.status(200).send(results);
    })
    .catch((error) => {
      console.error(
        `There was some error occured in fetching the counts`,
        error
      );
      return res.status(500).send(ERROR_MESSAGE);
    });
};

exports.getProductsCountsByCategoryId = async (req, res) => {
  let { categoryId } = req.params;
  await productRepository
    .getProductCountByCategoryId(categoryId)
    .then((results) => {
      if (results === 0) {
        console.log(
          `There is no document present in database with categoryId : ${categoryId}.`
        );
        return res
          .send(404)
          .send(
            `There is no document present in database with categoryId : ${categoryId}.`
          );
      }
      console.info(
        `There are ${results} documents present in the database with categoryId: ${categoryId}.`
      );
      return res.status(200).send(results);
    })
    .catch((error) => {
      console.error(
        `There was some error occured in fetching the counts`,
        error
      );
      return res.status(500).send(ERROR_MESSAGE);
    });
};
