const express = require("express");

const Router = express();

const movieRoutes = require("../modules/Movie/movieRoutes");
const scheduleRoutes = require("../modules/schedule/scheduleRoutes");
const bookingRoutes = require("../modules/booking/bookingRoutes");

Router.use("/movie", movieRoutes);
Router.use("/schedule", scheduleRoutes);
Router.use("/booking", bookingRoutes);

// Router.get("/hello", (req, res) => {
//   res.status(200);
//   res.send("hello word");
// });

module.exports = Router;
