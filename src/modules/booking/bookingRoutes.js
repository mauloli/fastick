const express = require("express");

const Router = express.Router();
const bookingController = require("./bookingController");

Router.post("/", bookingController.createBooking);
Router.get("/dashboard", bookingController.getBookingDashboard);
Router.patch("/:id", bookingController.updateBooking);
Router.get("/:id", bookingController.getBookingByid);
Router.get("/", bookingController.getBookingSeat);
Router.get("/dashboard", bookingController.getBookingDashboard);
module.exports = Router;
