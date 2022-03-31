const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const helperWrapper = require("../../helper/wrapper");
const authModel = require("./authModel");

module.exports = {
  register: async (req, res) => {
    try {
      req.body.password = crypto
        .createHmac("sha256", "tickitz")
        .update(req.body.password)
        .digest("hex");
      const { firstName, lastName, noTelp, email, password, role } = req.body;
      console.log(req.body.password);

      // 1. encrypt password
      // 2. cek apakah email sudah terdaftar apa blm
      const setData = {
        firstName,
        lastName,
        noTelp,
        email,
        password,
      };
      const checkUser = await authModel.getUserByEmail(email);
      if (checkUser.length > 0) {
        return helperWrapper.response(res, 400, "email sudah terdaftar", null);
      }
      const result = await authModel.register(setData);
      return helperWrapper.response(res, 200, "succes register user", result);
    } catch {
      return helperWrapper.response(res, 400, "bad request", null);
    }
  },
  login: async (req, res) => {
    try {
      req.body.password = crypto
        .createHmac("sha256", "tickitz")
        .update(req.body.password)
        .digest("hex");
      const { email, password } = req.body;

      const checkUser = await authModel.getUserByEmail(email);
      //   1. jika email tidak ada did alam database
      if (checkUser.length < 1) {
        return helperWrapper.response(res, 404, "Email not registed", null);
      }

      // 2. jika password ketika di cocokkan salah
      if (password !== checkUser[0].password) {
        return helperWrapper.response(res, 400, "Wrong password", null);
      }

      // jwt
      const payload = checkUser[0];
      delete payload.password;

      const token = jwt.sign({ ...payload }, "RAHASIA", { expiresIn: "1h" });
      return helperWrapper.response(res, 200, "succes login", {
        id: payload.id,
        token,
      });
    } catch (error) {
      return helperWrapper.response(res, 400, "bad request".null);
    }
  },
};
