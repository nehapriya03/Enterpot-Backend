const jwt = require("jsonwebtoken");
const salesPersonRepository = require("../repository/SalesPersonRepository");
const SalesPerson = require("../models/SalesPersonModel");
const bcrypt = require("bcrypt");
const envData = process.env;

const ERROR_MESSAGE = "An Internal server error occured.";

exports.addUser = async (req, res) => {
  let { name, email, password, phoneNumber, isActive, addedDate } = req.body;
  await salesPersonRepository
    .getSalesPersonByEmail(email)
    .then(async (userFound) => {
      if (userFound !== null) {
        console.error(`Sales person with email: ${email} already exists.`);
        return res
          .status(400)
          .send(`Sales person with email: ${email} already exists.`);
      }

      bcrypt.hash(password, 12, async (error, hash) => {
        if (error) {
          console.error(`There was an error while encrypting the password.`);
        }
        password = hash;

        let salesPerson = new SalesPerson({
          name,
          email,
          password,
          phoneNumber,
          isActive,
          addedDate,
        });

        await salesPersonRepository
          .addSalesPerson(salesPerson)
          .then((salesPersonAdded) => {
            console.info(
              `Sales person with email: ${email} has been sucessfully added.`
            );
            return res.status(200).send(salesPersonAdded);
          })
          .catch((error) => {
            console.error(
              `There was an error while adding the sales person.`,
              error
            );
            return res.status(500).send(ERROR_MESSAGE);
          });
      });
    })
    .catch((error) => {
      console.error(
        `Sales person with email: ${email} does not exists.`,
        error
      );
      res
        .status(404)
        .send(`Sales person with email: ${email} does not exists.`);
    });
};

exports.getAllSalesPersons = async (req, res) => {
  await salesPersonRepository
    .getAllSalesPerson()
    .then((salesPersonFound) => {
      if (salesPersonFound !== null) {
        console.info("All salesperson has been sucessfully found");
        return res.status(200).send(salesPersonFound);
      }
      console.info(`No users are present in the database.`);
      return res
        .status(404)
        .send(`No salesperson are present in the database.`);
    })
    .catch((error) => {
      console.error(
        `There was some error while fetching all the salespersns`,
        error
      );
      return res.status(500).send(ERROR_MESSAGE);
    });
};

exports.getAllSalesPersonById = async (req, res) => {
  const { id } = req.params;
  await salesPersonRepository
    .getSalesPersonById(id)
    .then((salespersonFound) => {
      if (salespersonFound === null) {
        console.error(`No salesperson with id: ${id} has been found.`);
        return res
          .status(404)
          .send(`No salesperson with id: ${id} has been found.`);
      }
      console.info(`Salesperson with id: ${id} has been sucessfully found.`);
      return res.status(200).send(salespersonFound);
    })
    .catch((error) => {
      console.error(
        `There was some error while fetching the salesperson with id: ${id}.`,
        error
      );
      return res.status(500).send(ERROR_MESSAGE);
    });
};

exports.getSalespersonByEmail = async (req, res) => {
  const { email } = req.params;
  await salesPersonRepository
    .getSalesPersonByEmail(email)
    .then((salespersonFound) => {
      if (salespersonFound === null) {
        console.info(`No salesperson with email: ${email} has been found.`);
        return res
          .status(404)
          .send(`No salesperson with email: ${email} has been found.`);
      }
      console.info(
        `Salesperson with email: ${email} has been sucessfully found.`
      );
      return res.status(200).send(salespersonFound);
    })
    .catch((error) => {
      console.error(
        `Some error occured while fetching the salesperson with email: ${email}`,
        error
      );
      return res.status(500).send(ERROR_MESSAGE);
    });
};

exports.updateSalespersonById = async (req, res) => {
  let { id: pathId } = req.params;
  let { _id, name, email, password, phoneNumber, isActive, addedDate } =
    req.body;

  if (pathId !== _id) {
    console.log(`Id in the path and body must be same.`);
    return res.status(400).send(`Id in the path and body must be same.`);
  }

  let salesPerson = new SalesPerson({
    _id,
    name,
    email,
    password,
    phoneNumber,
    isActive,
    // addedDate,
  });

  await salesPersonRepository
    .getSalesPersonById(_id)
    .then(async (foundSalesPerson) => {
      if (foundSalesPerson === null) {
        console.warn(
          `Salesperson with id ${_id} does not exists in the database.`
        );
        return res
          .status(404)
          .send(`Salesperson with id ${_id} does not exists in the database.`);
      }
      bcrypt.hash(password, 12, async (error, hash) => {
        if (error) {
          console.error(`There was an error while encrypting the password.`);
        }
        salesPerson.password = hash;

        await salesPersonRepository
          .updateSalesPersonById(salesPerson)
          .then((updatedSalesPerson) => {
            if (updatedSalesPerson.n === 0) {
              console.error(
                `Update Failed: salesperson with Id: ${_id} does not exists`
              );
              return res
                .status(400)
                .send(
                  `Update Failed: salesperson with id: ${_id} does not exists`
                );
            }
            console.info(
              `salesperson with id: ${_id} has been sucessfuly updated.`
            );
            return res
              .status(200)
              .send(`salesperson with id: ${_id} has been sucessfuly updated.`);
          })
          .catch((error) => {
            console.error(
              `There was an error while updating the salesperson with id: ${_id}.`,
              error
            );
            return res
              .status(500)
              .send(
                `There was an error while updating the salesperson with id: ${_id}.`
              );
          });
      });
    })
    .catch((error) => {
      console.error(`An internal server error occured`, error);
      return res.status(500).send(ERROR_MESSAGE);
    });
};

exports.salespersonLogin = async (req, res) => {
  let { email, password } = req.body;
  await salesPersonRepository
    .getSalesPersonByEmail(email)
    .then((salespersonFound) => {
      if (salespersonFound === null) {
        console.error(`No salesperson with email: ${email} has been found.`);
        return res
          .status(404)
          .send(`No salesperson with email: ${email} has been found.`);
      }

      bcrypt
        .compare(password, salespersonFound.password)
        .then((matches) => {
          if (matches) {
            const token = jwt.sign(
              {
                email: salespersonFound.email,
                password: salespersonFound.password,
              },
              envData.JWT_SECRETKEY,
              {
                expiresIn: "1h",
              }
            );
            console.log(`Login sucessfull`, token);
            return res.status(200).send(`Login sucessfull`);
          }
        })
        .catch((error) => {
          console.error(`Incorrect credentils`, error);
          return res.status(400).send(`Incorrect credentials.`);
        });
    });
};
