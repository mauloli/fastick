const express = require("express");

const Router = express.Router();
const bookingController = require("./bookingController");

Router.post("/", bookingController.createBooking);
Router.patch("/:id", bookingController.updateBooking);
Router.get("/:id", bookingController.getBookingByid);
module.exports = Router;
