const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const helperWrapper = require("../helper/wrapper");

module.exports = {
  handlingUploadUser: (request, response, next) => {
    const storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "tickitz/user",
      },
    });
    const upload = multer({ storage }).single("image");
    upload(request, response, (error) => {
      if (error instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return helperWrapper.response(response, 401, error.message, null);
      }
      if (error) {
        return helperWrapper.response(response, 401, error.message, null);
        // An unknown error occurred when uploading.
      }
      return next();
    });
  },
  handlingUploadMovie: (request, response, next) => {
    const storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "tickitz/movie",
      },
    });
    const upload = multer({ storage }).single("image");
    upload(request, response, (error) => {
      if (error instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return helperWrapper.response(response, 401, error.message, null);
      }
      if (error) {
        return helperWrapper.response(response, 401, error.message, null);
        // An unknown error occurred when uploading.
      }
      return next();
    });
  },
};
