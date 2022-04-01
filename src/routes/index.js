const express = require("express");

const Router = express();

const movieRoutes = require("../modules/Movie/movieRoutes");
const scheduleRoutes = require("../modules/schedule/scheduleRoutes");
const bookingRoutes = require("../modules/booking/bookingRoutes");
const userRoutes = require("../modules/user/userRoutes");
const authRoutes = require("../modules/auth/auth.Routes");
const middleWareAuth = require("../middleware/auth");

Router.use("/movie", middleWareAuth.authentication, movieRoutes);
Router.use("/schedule", middleWareAuth.authentication, scheduleRoutes);
Router.use("/booking", middleWareAuth.authentication, bookingRoutes);
Router.use("/user", middleWareAuth.authentication, userRoutes);
Router.use("/auth", authRoutes);

// Router.get("/hello", (req, res) => {
//   res.status(200);
//   res.send("hello word");
// });

module.exports = Router;
