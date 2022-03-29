const helperWrapper = require("../../helper/wrapper");
const movieModel = require("./movieModel");

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
      let { page, limit, searchName, sortMovie } = req.query;
      // console.log(typeof page);
      page = Number(page);
      limit = Number(limit);
      if (!searchName) searchName = "";
      if (!sortMovie) sortMovie = "name";
      if (!page) page = 1;
      if (!limit) limit = 3;

      const offset = page * limit - limit;
      const totalData = await movieModel.getCountMovie(searchName);
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
        sortMovie
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

      return helperWrapper.response(res, 200, "succes get data!", result);
    } catch {
      return helperWrapper.response(res, 400, "bad request", null);
    }
  },
  createMovie: async (req, res) => {
    try {
      const { name, category, synopsis, cast, director, duration } = req.body;
      const setData = {
        name,
        category,
        synopsis,
        cast,
        director,
        duration,
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
      const checkId = await movieModel.getMovieByID(id);
      if (checkId.length <= 0) {
        return helperWrapper.response(
          res,
          404,
          `data by id ${id} not found`,
          null
        );
      }
      const { name, category, synopsis, cast, director, duration } = req.body;
      const setData = {
        name,
        category,
        synopsis,
        cast,
        director,
        duration,
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
      const result = await movieModel.deleteMovie(id);
      if (result.length <= 0) {
        return helperWrapper.response(
          res,
          404,
          `data by id ${id} not found`,
          null
        );
      }

      return helperWrapper.response(res, 200, "succes get data!", result);
    } catch {
      return helperWrapper.response(res, 400, "bad request", null);
    }
  },
};
