const jwt = require("jsonwebtoken");
const redis = require("../config/redis");
const helperWrapper = require("../helper/wrapper");

module.exports = {
  authentication: async (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) {
      return helperWrapper.response(res, 403, "you are not logged in", null);
    }

    token = token.split(" ")[1];

    const checkRedis = await redis.get(`accessToken:${token}`);
    if (checkRedis) {
      return helperWrapper.response(
        res,
        403,
        "your token is destroyed! Please Login Again",
        null
      );
    }
    jwt.verify(token, "RAHASIA", (error, result) => {
      if (error) {
        return helperWrapper.response(res, 403, error.message, null);
      }

      req.decodeToken = result;

      next();
    });
  },

  isAdmin: (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
      return helperWrapper.response(res, 403, "loogin", null);
    }

    token = token.split(" ")[1];
    jwt.verify(token, "RAHASIA", (error, result) => {
      if (result.role !== "admin") {
        return helperWrapper.response(res, 403, "user cant do this", null);
      }

      req.decodeToken = result;

      next();
    });
  },
  isLogin: (req, res, next) => {
    let token = req.headers.authorization;
    const { id } = req.params;
    token = token.split(" ")[1];
    jwt.verify(token, "RAHASIA", (error, result) => {
      if (error) {
        return helperWrapper.response(res, 403, error.message, null);
      }

      if (id) {
        if (id != result.id) {
          return helperWrapper.response(
            res,
            400,
            "other user cannot do this",
            null
          );
        }
      }

      req.decodeToken = result;

      next();
    });
  },
};
