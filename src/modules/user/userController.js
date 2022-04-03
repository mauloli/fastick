const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const helperWrapper = require("../../helper/wrapper");
const userModel = require("./userModel");
const cloudinary = require("../../config/cloudinary");

module.exports = {
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await userModel.getUserById(id);
      if (result.length <= 0) {
        return helperWrapper.response(
          res,
          404,
          `data by id ${id} not found`,
          null
        );
      }
      const payload = result[0];
      delete payload.password;

      return helperWrapper.response(res, 200, "succes get data!", payload);
    } catch {
      return helperWrapper.response(res, 400, "bad request", null);
    }
  },
  updateUser: async (req, res) => {
    try {
      console.log(req.body);
      const { id } = req.params;
      const checkId = await userModel.getUserById(id);
      if (checkId.length <= 0) {
        return helperWrapper.response(
          res,
          404,
          `data by id ${id} not found`,
          null
        );
      }
      const { firstName, lastName, noTelp } = req.body;
      const setData = {
        firstName,
        lastName,
        noTelp,
        updatedAt: new Date(Date.now()),
      };

      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        // console.log(data); // property
        // console.log(setData[data]); // value
        if (!setData[data]) {
          delete setData[data];
        }
      }

      const result = await userModel.updateUser(id, setData);

      return helperWrapper.response(res, 200, "Success update data !", result);
    } catch {
      return helperWrapper.response(res, 400, "bad request", null);
      // console.error();
    }
  },
  updateUserImg: async (req, res) => {
    try {
      // console.log(req.file.filename);
      const { id } = req.params;
      const checkId = await userModel.getUserById(id);
      const checkImage = await userModel.getUserByImage(id);
      if (checkId.length <= 0) {
        return helperWrapper.response(
          res,
          404,
          `data by id ${id} not found`,
          null
        );
      }
      // if (checkImage.length <= 0) {
      //   return helperWrapper.response(
      //     res,
      //     404,
      //     `data image by id ${id} not found`,
      //     null
      //   );
      // }else{

      // }
      console.log(checkImage[0].image);
      cloudinary.uploader.destroy(`${checkImage[0].image}`, (result) => {
        console.log(result);
      });

      let image = req.file.filename;
      if (!image) {
        image = "";
      }
      const setData = {
        image,
        updatedAt: new Date(Date.now()),
      };

      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        // console.log(data); // property
        // console.log(setData[data]); // value
        if (!setData[data]) {
          delete setData[data];
        }
      }
      // console.log(setData);
      const result = await userModel.updateUserImg(id, setData);

      return helperWrapper.response(res, 200, "Success update image !", result);
    } catch {
      return helperWrapper.response(res, 400, "bad request", null);
      // console.error();
    }
  },
  updatePassword: async (req, res) => {
    try {
      // console.log(req.body);
      const { id } = req.params;

      const checkId = await userModel.getUserById(id);
      if (checkId.length <= 0) {
        return helperWrapper.response(
          res,
          404,
          `data by id ${id} not found`,
          null
        );
      }
      const { newPassword, confirmPassword } = req.body;

      // eslint-disable-next-line no-restricted-syntax
      if (newPassword !== confirmPassword) {
        return helperWrapper.response(res, 400, "password not match");
      }
      req.body.newPassword = crypto
        .createHmac("sha256", "tickitz")
        .update(req.body.newPassword)
        .digest("hex");

      const result = await userModel.updatePassword(id, req.body.newPassword);

      return helperWrapper.response(
        res,
        200,
        "Success update password !",
        result
      );
    } catch {
      return helperWrapper.response(res, 400, "bad request", null);
      // console.error();
    }
  },
  activateUser: async (req, res) => {
    try {
      // console.log(req.body);
      const { id } = req.params;
      const decode = jwt.verify(id, "iduser");

      const checkId = await userModel.getUserById(decode.id);
      const setData = {
        status: "active",
      };
      console.log(setData);
      if (checkId.length <= 0) {
        return helperWrapper.response(
          res,
          404,
          `data by id ${id} not found`,
          null
        );
      }

      // eslint-disable-next-line no-restricted-syntax

      const result = await userModel.activateUser(decode.id, setData);

      return helperWrapper.response(res, 200, "Success update data !", result);
    } catch {
      return helperWrapper.response(res, 400, "bad request", null);
      // console.error();
    }
  },
};
