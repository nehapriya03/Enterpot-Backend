const cartRepository = require("../repository/CartRepository");
const cartModel = require("../models/CartModel");

exports.addCart = async (req, res) => {
  let { userId, salespersonId, order, lastModifiedDate } = req.body;
  let cart = new cartModel({
    userId,
    salespersonId,
    order,
    lastModifiedDate,
  });

  await cartRepository
    .addCart(cart)
    .then((cartAdded) => {
      console.info(`Cart has been successfully added.`);
      return res.status(200).send(cartAdded);
    })
    .catch((error) => {
      console.error(`There was an error while adding the cart.`, error);
      return res.status(500).send(`There was an error while adding the cart.`);
    });
};

exports.getCartByUserIdAndSalespersonId = async (req, res) => {
  // let { userId, salespersonId } = req.query.params;
  let userId = req.query.userId;
  let salespersonId = req.query.salespersonId;

  await cartRepository
    .getCartByUserIdAndSalespersonId(userId, salespersonId)
    .then((cartFound) => {
      if (cartFound === null) {
        console.info(
          `No cart with userId: ${userId} and salespersonId: ${salespersonId} was not found.`
        );
        return res
          .status(404)
          .send(
            `No cart with userId: ${userId} and salespersonId: ${salespersonId} was not found.`
          );
      }

      console.info(
        `cart with userId: ${userId} and salespersonId: ${salespersonId} was found sucessfully.`
      );
      return res.status(200).send(cartFound);
    })
    .catch((error) => {
      console.error(`There was an error while finding the cart.`, error);
      return res.status(500).send(`There was an error while finding the cart.`);
    });
};

exports.upsertCart = async (req, res) => {
  let { userId, salespersonId, order, lastModifiedDate } = req.body;
  let cart = new cartModel({
    userId,
    salespersonId,
    order,
    lastModifiedDate,
  });
  await cartRepository
    .upsertCart(cart)
    .then((cartUpdated) => {
      if (cartUpdated === 0) {
        console.info(`Cart has not been updated in the database.`);
        return res
          .status(400)
          .send(`Cart has not been updated in the database.`);
      }
      console.info(`Cart has been updated in the database.`);
      return res.status(200).send(`Cart has been updated in the database.`);
    })
    .catch((error) => {
      console.error(`There was an error.`, error);
      return res.status(500).send(`There was an error.`);
    });
};
