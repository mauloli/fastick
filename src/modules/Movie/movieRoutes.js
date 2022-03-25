const express = require("express");

const Router = express.Router();

const movieController = require("./movieController");

Router.get("/", movieController.getAllMovie);
Router.get("/:id", movieController.getMovieByID);
Router.post("/", movieController.createMovie);
Router.patch("/:id", movieController.updateMovie);
Router.delete("/:id", movieController.deleteMovie);
// Router.get("/hello", (req, res) => {
//   res.status(200);
//   res.send("helo word");
// });

module.exports = Router;
