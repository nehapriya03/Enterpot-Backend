const jwt = require("jsonwebtoken");
const salesPersonRepository = require("../repository/SalesPersonRepository");
const SalesPerson = require("../models/SalesPersonModel");
const bcrypt = require("bcrypt");

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
