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
    const upload = multer({
      storage,
      fileFilter(req, file, callback) {
        const { mimetype } = file;
        if (mimetype !== "image/png" && mimetype !== "image/jpeg") {
          return callback(new Error("File must JPG or PNG "));
        }
        return callback(null, true);
      },
      limits: {
        fileSize: 512000,
      },
    }).single("image");
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
    const upload = multer({
      storage,
      fileFilter(req, file, callback) {
        const { mimetype } = file;
        if (mimetype !== "image/png" && mimetype !== "image/jpeg") {
          return callback(new Error("File must JPG or PNG "));
        }
        return callback(null, true);
      },
      limits: {
        fileSize: 1024000,
      },
    }).single("image");
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
