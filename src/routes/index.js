const express = require("express");

const Router = express();

const movieRoutes = require("../modules/Movie/movieRoutes");
const scheduleRoutes = require("../modules/schedule/scheduleRoutes");

Router.use("/movie", movieRoutes);
Router.use("/schedule", scheduleRoutes);

// Router.get("/hello", (req, res) => {
//   res.status(200);
//   res.send("hello word");
// });

module.exports = Router;
