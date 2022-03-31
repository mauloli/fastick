const express = require("express");

const Router = express.Router();

const movieController = require("./movieController");
const middlewareAuth = require("../../middleware/auth");

const middlewareUpload = require("../../middleware/upload");
const middlewareRedis = require("../../middleware/redis");

Router.get(
  "/",
  middlewareAuth.authentication,
  middlewareRedis.getMovieRedis,
  movieController.getAllMovie
);
Router.get(
  "/:id",
  middlewareRedis.getMovieByIdRedis,
  movieController.getMovieByID
);
Router.post(
  "/",
  middlewareAuth.isAdmin,
  middlewareUpload.handlingUploadMovie,
  movieController.createMovie
);
Router.patch(
  "/:id",
  middlewareRedis.clearMovieRedis,
  movieController.updateMovie
);
Router.delete("/:id", movieController.deleteMovie);

// Router.get("/hello", (req, res) => {
//   res.status(200);
//   res.send("helo word");
// });

module.exports = Router;
