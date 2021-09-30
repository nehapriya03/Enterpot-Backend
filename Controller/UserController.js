const userRepository = require("../repository/UserRepository");
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const { Mongoose } = require("mongoose");
const envData = process.env;

const ERROR_MESSAGE = "An internal server error occured.";

exports.addUser = async (req, res) => {
  let {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    businessName,
    address,
  } = req.body;
  await userRepository
    .getUserByEmail(email)
    .then(async (results) => {
      if (results !== null) {
        console.error(`An user with email id: ${email} already exists.`);
        return res
          .status(409)
          .send(`An user with email id: ${email} already exists.`);
      }
      bcrypt.hash(password, 12, async (error, hash) => {
        if (error) {
          console.error("There was an issue while encrpting the password.");
        }
        password = hash;

        const user = new User({
          firstName,
          lastName,
          email,
          password,
          phoneNumber,
          businessName,
          address,
        });

        await userRepository
          .addUser(user)
          .then((addedUser) => {
            console.info(
              `User with email: ${email} has been addedd sucessfully.`
            );
            return res.status(200).json(addedUser);
          })
          .catch((error) => {
            console.error(`There was an error while adding the user`, error);
            return res.status(500).send(error.message);
          });
      });
    })
    .catch((error) => {
      console.error(`User with email: ${email} does not exists.`, error);
      res.status(404).send(`User with email: ${email} does not exists.`);
    });
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;

  await userRepository
    .getUserById(id)
    .then((results) => {
      if (results === null) {
        console.error(`User with id : ${id} was not found`);
        return res.status(404).send(`User with id : ${id} was not found`);
      }
      console.info(`User with id: ${id} was sucessfully found.`);
      return res.status(200).json(results);
    })
    .catch((error) => {
      console.error(`There was an error while finding the user`, error);
      return res.status(500).send(ERROR_MESSAGE);
    });
};

exports.getUserByEmail = async (req, res) => {
  let { email } = req.params;
  await userRepository
    .getUserByEmail(email)
    .then((userFound) => {
      if (userFound !== null) {
        console.info(`User with email: ${email} has been sucessfully found.`);
        return res.status(200).send(userFound);
      }
      console.info(`No user with email: ${email} was found.`);
      return res.status(404).send(`No user with email: ${email} was found.`);
    })
    .catch((error) => {
      console.error(`There was an error while finding the user`, error);
      return res.status(500).send(ERROR_MESSAGE);
    });
};

exports.getAllUsers = async (req, res) => {
  await userRepository
    .getAllUser()
    .then((users) => {
      if (users !== null) {
        console.info(`All users has been sucessfully found.`);
        return res.status(200).json(users);
      }
      console.info(`No users are present in the database.`);
      return res.status(404).send(`No users are present in the database.`);
    })
    .catch((error) => {
      console.error(`There was an error while finding the users.`, error);
      return res.status(500).send(ERROR_MESSAGE);
    });
};

const getUsersByBussinessNameRegex = async (req, res) => {
  await userRepository
    .getUsersByBusinessNameRegex(req.body)
    .then((businessNameFound) => {
      if (businessNameFound.length !== 0) {
        console.info(
          `BusinessName with regex : ${req.body} was sucessfully found`
        );
        return res.status(200).send(businessNameFound);
      }
      console.log(`BusinessName with regex : ${req.body} was not found`);
      return res
        .status(404)
        .send(`BusinessName with regex : ${req.body} was not found`);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send(ERROR_MESSAGE);
    });
};

const getUsersByBusinessNameIndexSearch = async (req, res) => {
  await userRepository
    .getUsersByBusinessNameIndexSearch(req.body)
    .then((busniessNameFoundByIndex) => {
      if (busniessNameFoundByIndex.length !== 0) {
        console.info(
          `Indexed search with business name : ${req.body} was sucessfully executed.`
        );
        return res.status(200).send(busniessNameFoundByIndex);
      }
      console.info(
        `Indexed search with bussiness name: ${req.body} was not found in database.`
      );
      return res
        .status(404)
        .send(
          `Indexed search with bussiness name: ${req.body} was not found in database.`
        );
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send(ERROR_MESSAGE);
    });
};

exports.getUsersByBusinessNameSearch = async (req, res) => {
  switch (req.query.type) {
    case "R":
      return await getUsersByBussinessNameRegex(req, res);
    case "I":
      return await getUsersByBusinessNameIndexSearch(req, res);
    default:
      console.error(res.status(404).send(`Please enter correct query type.`));
  }
};

exports.updateUserById = async (req, res) => {
  let { id: pathId } = req.params;
  let {
    _id,
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    businessName,
    address,
  } = req.body;

  if (pathId !== _id) {
    console.log(`Id in the path and body must be same.`);
    return res.status(400).send(`Id in the path and body must be same.`);
  }

  let user = new User({
    _id,
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    businessName,
    address,
  });

  await userRepository
    .getUserById(_id)
    .then(async (foundUser) => {
      if (foundUser === null) {
        console.warn(`User with id ${_id} does not exists in the database.`);
        return res
          .status(404)
          .send(`User with id ${_id} does not exists in the database.`);
      }
      bcrypt.hash(password, 12, async (error, hash) => {
        if (error) {
          console.error(`There was an error while encrypting the password.`);
        }
        user.password = hash;

        await userRepository
          .updateUserById(user)
          .then((updatedUser) => {
            if (updatedUser.n === 0) {
              console.error(
                `Update Failed: user with Id: ${_id} does not exists`
              );
              return res
                .status(400)
                .send(`Update Failed: user with id: ${_id} does not exists`);
            }
            console.info(`User with id: ${_id} has been sucessfuly updated.`);
            return res
              .status(200)
              .json(`User with id: ${_id} has been sucessfuly updated.`);
          })
          .catch((error) => {
            console.error(
              `There was an error while updating the user with id: ${_id}.`,
              error
            );
            return res
              .status(500)
              .send(
                `There was an error while updating the user with id: ${_id}.`
              );
          });
      });
    })
    .catch((error) => {
      console.error(`An internal serber error occured`, error);
      return res.status(500).send(ERROR_MESSAGE);
    });
};

exports.userLogin = async (req, res) => {
  let { email, password } = req.body;
  await userRepository.getUserByEmail(email).then((userFound) => {
    if (userFound === null) {
      console.error(`No user with email: ${email} has been found.`);
      return res
        .status(404)
        .send(`No user with email: ${email} has been found.`);
    }

    bcrypt
      .compare(password, userFound.password)
      .then((matches) => {
        if (matches) {
          const token = jwt.sign(
            {
              email: userFound.email,
              password: userFound.password,
            },
            envData.JWT_SECRETKEY,
            {
              expiresIn: "1h",
            }
          );
          console.log(`Login sucessfull`, token);
          return res.status(200).send(`Login sucessfull`);
        }
        console.error(`Incorrect credentials.`);
        return res.status(400).send(`Incorrect credentials.`);
      })
      .catch((error) => {
        console.error(`Some error occured in logging in`, error);
        return res.status(400).send(ERROR_MESSAGE);
      });
  });
};
