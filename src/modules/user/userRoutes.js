const express = require("express");

const Router = express.Router();
const userController = require("./userController");
const middlewareAuth = require("../../middleware/auth");
const middlewareUpload = require("../../middleware/upload");

Router.get(
  "/:id",
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  userController.getUserById
);
Router.patch(
  "/image/:id",
  middlewareAuth.authentication,
  middlewareAuth.isLogin,
  middlewareUpload.handlingUploadUser,
  userController.updateUserImg
);
Router.patch(
  "/password/:id",
  middlewareAuth.authentication,
  middlewareAuth.isLogin,
  userController.updatePassword
);
Router.patch("/activate/:id", userController.activateUser);
Router.patch(
  "/:id",
  middlewareAuth.authentication,
  middlewareAuth.isLogin,
  userController.updateUser
);

module.exports = Router;
