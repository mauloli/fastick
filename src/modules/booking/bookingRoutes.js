const express = require("express");

const Router = express.Router();
const bookingController = require("./bookingController");

Router.post("/", bookingController.createBooking);

module.exports = Router;
