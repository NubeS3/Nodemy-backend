const express = require("express");

const generateAdminJwt = require("../utils/adminJwt");

const requestValidation = require("../middlewares/requestValidation.middleware");
const loginAdminRequest = require("../requests/admin/loginAdmin.request");

const adminRoute = express.Router();

// Login with Nodemy account
adminRoute.post(
  "/admin/login",
  requestValidation(loginAdminRequest),
  async (req, res) => {
    try {
      // const user = await User.findByCredentials(req.body.email.toLowerCase(), req.body.password);
      const {adminUsername, password} = req.body;

      if (
        adminUsername === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
      ) {

        const accessToken = generateAdminJwt();
        res.status(201).send({
          accessToken,
        });
      }


    } catch (error) {
      res.status(401).send({
        error: "Unable to login!",
      });
    }
  }
);

module.exports = adminRoute;
