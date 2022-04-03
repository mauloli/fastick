const express = require("express");

const Router = express.Router();
const userController = require("./userController");
const middlewareAuth = require("../../middleware/auth");
const middlewareUpload = require("../../middleware/upload");

Router.get("/:id", middlewareAuth.isAdmin, userController.getUserById);
Router.patch(
  "/image/:id",
  middlewareUpload.handlingUploadUser,
  userController.updateUserImg
);
Router.patch(
  "/password/:id",
  middlewareAuth.isLogin,
  userController.updatePassword
);
Router.patch("/activate/:id", userController.activateUser);
Router.patch("/:id", middlewareAuth.isLogin, userController.updateUser);

module.exports = Router;
