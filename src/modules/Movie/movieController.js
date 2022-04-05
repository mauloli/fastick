const redis = require("../../config/redis");
const helperWrapper = require("../../helper/wrapper");
const movieModel = require("./movieModel");
const cloudinary = require("../../config/cloudinary");

module.exports = {
  getHello: async (req, res) => {
    try {
      return helperWrapper.response(
        res,
        200,
        "succes get data!",
        "hello world"
      );
    } catch {
      return helperWrapper.response(res, 400, "bad request", null);
    }
  },
  getAllMovie: async (req, res) => {
    try {
      let { page, limit, searchName, sortMovie, month } = req.query;

      // console.log(typeof page);
      page = Number(page);
      limit = Number(limit);
      if (!searchName) searchName = "";
      if (!sortMovie) sortMovie = "name";
      if (!month) month = "";
      if (!page) page = 1;
      if (!limit) limit = 3;

      const offset = page * limit - limit;
      const totalData = await movieModel.getCountMovie(searchName, month);
      const totalPage = Math.ceil(totalData / limit);

      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData,
      };
      const result = await movieModel.getAllMovie(
        limit,
        offset,
        searchName,
        sortMovie,
        month
      );
      redis.setEx(
        `getMovie:${JSON.stringify(req.query)}`,
        3600,
        JSON.stringify({ result, pageInfo })
      );

      return helperWrapper.response(
        res,
        200,
        "succes get data!",
        result,
        pageInfo
      );
    } catch {
      return helperWrapper.response(res, 400, "bad request", null);
    }
  },
  getMovieByID: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await movieModel.getMovieByID(id);

      if (result.length <= 0) {
        return helperWrapper.response(
          res,
          404,
          `data by id ${id} not found`,
          null
        );
      }
      // PROSES SIMPAN KE REDIS
      console.log(result[0].image);
      redis.setEx(`getMovie:${id}`, 3600, JSON.stringify(result));
      return helperWrapper.response(res, 200, "succes get data!", result);
    } catch {
      return helperWrapper.response(res, 400, "bad request", null);
    }
  },

  createMovie: async (req, res) => {
    try {
      const image = `${req.file.filename}.${req.file.mimetype.split("/")[1]}`;
      console.log(image);
      // console.log(image);
      const { name, category, synopsis, cast, director, duration } = req.body;
      const setData = {
        name,
        category,
        synopsis,
        cast,
        director,
        duration,
        image,
      };
      const result = await movieModel.createMovie(setData);

      return helperWrapper.response(res, 200, "Success create data !", result);
    } catch {
      return helperWrapper.response(res, 400, "bad request", null);
    }
  },
  updateMovie: async (req, res) => {
    try {
      const { id } = req.params;
      const image = req.file.filename;
      const checkId = await movieModel.getMovieByID(id);

      if (checkId.length <= 0) {
        return helperWrapper.response(
          res,
          404,
          `data by id ${id} not found`,
          null
        );
      }
      cloudinary.uploader.destroy(
        `${checkId[0].image.split(".")[0]}`,
        (result) => {
          console.log(result);
        }
      );
      const { name, category, synopsis, cast, director, duration } = req.body;
      const setData = {
        name,
        category,
        synopsis,
        cast,
        director,
        duration,
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

      const result = await movieModel.updateMovie(id, setData);

      return helperWrapper.response(res, 200, "Success update data !", result);
    } catch {
      return helperWrapper.response(res, 400, "bad request", null);
      // console.error();
    }
  },
  deleteMovie: async (req, res) => {
    try {
      const { id } = req.params;
      const checkImage = await movieModel.getMovieByID(id);
      console.log(checkImage[0].image);
      cloudinary.uploader.destroy(`${checkImage[0].image}`, (result) => {
        console.log(result);
      });
      const result = await movieModel.deleteMovie(id);

      if (result.length <= 0) {
        return helperWrapper.response(
          res,
          404,
          `data by id ${id} not found`,
          null
        );
      }

      return helperWrapper.response(res, 200, "succes delete data!", result);
    } catch {
      return helperWrapper.response(res, 400, "bad request", null);
    }
  },
};
