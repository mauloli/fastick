const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const redis = require("../../config/redis");
const helperWrapper = require("../../helper/wrapper");
const authModel = require("./authModel");
const { sendMail } = require("../../helper/mail");

module.exports = {
  register: async (req, res) => {
    try {
      req.body.password = crypto
        .createHmac("sha256", "tickitz")
        .update(req.body.password)
        .digest("hex");
      const { firstName, lastName, noTelp, email, password } = req.body;
      // console.log(req.body.password);

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
      const { id } = result;
      const tokenId = jwt.sign({ id }, "iduser", { expiresIn: "24h" });

      const setSendEmail = {
        to: "maulana.sholihin@raharja.info",
        subject: "Email Verfication",
        name: firstName,
        template: "verificationEmail.html",
        buttonUrl: `http://localhost:3001/user/activate/${tokenId}`,
      };
      await sendMail(setSendEmail);
      return helperWrapper.response(
        res,
        200,
        "succes register user, check email for activate your account!",
        result
      );
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
      if (checkUser[0].status !== "active") {
        return helperWrapper.response(
          res,
          404,
          "please activate your account",
          null
        );
      }

      // jwt
      const payload = checkUser[0];

      delete payload.password;

      const token = jwt.sign({ ...payload }, "RAHASIA", { expiresIn: "12h" });
      const refreshToken = jwt.sign({ ...payload }, "RAHASIABARU", {
        expiresIn: "24h",
      });

      return helperWrapper.response(res, 200, "succes login", {
        id: payload.id,
        token,
        refreshToken,
      });
    } catch (error) {
      console.log(error);

      return helperWrapper.response(res, 400, "bad request".null);
    }
  },
  // eslint-disable-next-line consistent-return
  refresh: async (request, response) => {
    try {
      console.log(request.body);
      const { refreshToken } = request.body;
      const checkToken = await redis.get(`refreshToken:${refreshToken}`);
      if (checkToken) {
        return helperWrapper.response(
          response,
          403,
          "Your refresh token cannot be use",
          null
        );
      }
      jwt.verify(refreshToken, "RAHASIABARU", async (error, result) => {
        const payload = result;
        delete payload.iat;
        delete payload.exp;
        console.log(payload);

        const token = jwt.sign(payload, "RAHASIA", { expiresIn: "1h" });
        const newRefreshToken = jwt.sign(payload, "RAHASIABARU", {
          expiresIn: "24h",
        });
        await redis.setEx(
          `refreshToken:${refreshToken}`,
          3600 * 48,
          refreshToken
        );
        return helperWrapper.response(response, 200, "Success refresh token", {
          id: result.id,
          token,
          refreshToken: newRefreshToken,
        });
      });
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  logout: async (request, response) => {
    try {
      let token = request.headers.authorization;
      const { refreshToken } = request.body;
      token = token.split(" ")[1];
      redis.setEx(`accessToken:${token}`, 3600 * 24, token);
      redis.setEx(`refreshToken:${refreshToken}`, 3600 * 24, token);
      return helperWrapper.response(response, 200, "Success logout", null);
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
