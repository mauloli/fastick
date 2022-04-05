const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const helperWrapper = require("../../helper/wrapper");
const authModel = require("./authModel");
const transporter = require("../../config/transporter");

module.exports = {
  register: async (req, res) => {
    try {
      req.body.password = crypto
        .createHmac("sha256", "tickitz")
        .update(req.body.password)
        .digest("hex");
      const { firstName, lastName, noTelp, email, password } = req.body;
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
      const { id } = checkUser[0];

      if (checkUser[0].status !== "active") {
        const tokenId = jwt.sign({ id }, "iduser");
        const mailOptions = {
          from: "maulanasholihinoli@gmail.com",
          to: "maulana.sholihin@raharja.info",
          subject: "Sending Email using Node.js",
          text: `test`,
          html: `<p>http://localhost:3001/user/activate/${tokenId}</p>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log(`Email sent: ${info.response}`);
          }
        });
        return helperWrapper.response(
          res,
          404,
          "please activate your account",
          null
        );
      }

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

      const token = jwt.sign({ ...payload }, "RAHASIA", { expiresIn: "12h" });
      // const tokenId= jwt.sign({})
      return helperWrapper.response(res, 200, "succes login", {
        id: payload.id,
        token,
      });
    } catch (error) {
      return helperWrapper.response(res, 400, "bad request".null);
    }
  },
};
