const express = require("express");

const Router = express.Router();
const bookingController = require("./bookingController");
const middleWareAuth = require("../../middleware/auth");

Router.post("/", bookingController.createBooking);
Router.post(
  "/midtrans-notification",
  bookingController.postMidtransNotification
);
Router.get(
  "/dashboard",
  middleWareAuth.authentication,
  bookingController.getBookingDashboard
);
Router.patch(
  "/:id",
  middleWareAuth.authentication,
  bookingController.updateBooking
);
Router.get(
  "/:id",
  middleWareAuth.authentication,
  bookingController.getBookingByid
);
Router.get(
  "/user/:id",
  middleWareAuth.authentication,
  bookingController.getBookingByUserId
);
Router.get(
  "/",
  middleWareAuth.authentication,
  bookingController.getBookingSeat
);

module.exports = Router;
