const adminRepository = require("../repository/AdminRepository");
const Admin = require("../models/AdminModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const envData = process.env;

const ERROR_MESSAGE = "An internal server error occured";

exports.addAdmin = async (req, res) => {
  let { email, password } = req.body;
  await adminRepository
    .getAdminByEmail(email)
    .then(async (result) => {
      if (result !== null) {
        console.info(`An admin with ${email} already exists`);
        return res.status(409).send(`An admin with ${email} already exists`);
      }

      bcrypt.hash(password, 12, async (error, hash) => {
        if (error) {
          console.error(
            `There was an error while encrypting the password`,
            error
          );
        }
        password = hash;

        const admin = new Admin({
          email,
          password,
        });

        await adminRepository
          .addAdmin(admin)
          .then((addedAdmin) => {
            const token = jwt.sign(
              {
                email: addedAdmin.email,
                password: addedAdmin.password,
              },
              envData.JWT_SECRETKEY,
              {
                expiresIn: "1h",
              }
            );
            console.log(
              `An admin with email: ${addedAdmin.email} added suessfully `
            );
            return res.status(200).json({ admin: addedAdmin, token });
          })
          .catch((error) => {
            console.error(`There was an error while adding the admin`, error);
            return res.status(500).send(ERROR_MESSAGE);
          });
      });
    })
    .catch((error) => {
      console.error(`An admin with email: ${email} does not exists.`);
      res.status(404).send(`An admin with email: ${email} does not exists.`);
    });
};

exports.getAdminById = async (req, res) => {
  let { id } = req.params;
  await adminRepository
    .getAdminById(id)
    .then((result) => {
      if (result === null) {
        console.error(`An admin with id: ${id} was not found.`);
        return res.status(404).send(`An admin with id: ${id} was not found.`);
      }
      console.log(`An admin with id: ${id} was sucessfully found.`);
      return res.status(200).send(result);
    })
    .catch((error) => {
      console.error(
        `There was an internal server error while fetching an admin with id: ${id}`,
        error
      );
      return res
        .status(500)
        .send(
          `There was an internal server error while fetching an admin with id: ${id}`
        );
    });
};

exports.getAdminByEmail = async (req, res) => {
  const { email } = req.params;
  await adminRepository
    .getAdminByEmail(email)
    .then((adminFound) => {
      if (adminFound === null) {
        console.log(`An admin with email: ${email} was not found.`);
        return res
          .status(404)
          .send(`An admin with email: ${email} was not found.`);
      }
      console.info(`An admin with email: ${email} was sucessfully found.`);
      return res.status(200).json(adminFound);
    })
    .catch((error) => {
      console.error(
        `There was an error while fetching an admin with email: ${email}`,
        error
      );
      return res
        .status(500)
        .send(
          `There was an error while fetching an admin with email: ${email}`
        );
    });
};

exports.updateAdminById = async (req, res) => {
  const { adminId } = req.params;
  let { id, email, password } = req.body;

  if (id !== adminId) {
    console.error("Id in the body and path must be same");
    return res.status(400).send("The ID in the body and the path must be same");
  }

  let admin = {
    id,
    email,
    password,
  };
  await adminRepository
    .getAdminById(adminId)
    .then(async (foundUser) => {
      if (foundUser === null) {
        console.error(`Admin with id: ${adminId} does not exists.`);
        return res
          .status(404)
          .send(`Admin with id: ${adminId} does not exists.`);
      }

      bcrypt.hash(password, 12, async (error, hash) => {
        if (error) {
          console.error(
            `There was an error while encrypting the password`,
            error
          );
        }
        admin.password = hash;

        await adminRepository
          .updateAdminById(admin)
          .then((adminUpdated) => {
            if (adminUpdated.n > 0) {
              console.error(
                `Update Failed: admin with Id: ${id} does not exists`
              );
              return res
                .status(400)
                .send(`Update Failed: Admin with id: ${id} does not exists`);
            }
            console.info(`Admin with id: ${id} has been sucessfully updated. `);
            return res.status(200).json(admin);
          })
          .catch((error) => {
            console.error(
              `There was an error while updating the amin with id ${id}.`,
              error
            );
            return res.status(500).send(ERROR_MESSAGE);
          });
      });
    })
    .catch((error) => {
      console.log(
        `An admin with id: ${id} was found but could not be updated.`
      );
      return res.status(500).send(ERROR_MESSAGE);
    });
};
