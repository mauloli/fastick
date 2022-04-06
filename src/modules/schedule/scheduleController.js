const helperWrapper = require("../../helper/wrapper");
const scheduleModel = require("./scheduleModel");
const redis = require("../../config/redis");

module.exports = {
  getAllSchedule: async (req, res) => {
    try {
      let { page, limit, searchMovieid, searchLocation, sortSchedule } =
        req.query;
      // console.log(typeof page);
      page = Number(page);
      limit = Number(limit);

      if (!searchMovieid) searchMovieid = 2;
      if (!searchLocation) searchLocation = "";
      if (!sortSchedule) sortSchedule = "id";
      if (!page) page = 1;
      if (!limit) limit = 10;

      const offset = page * limit - limit;
      const totalData = await scheduleModel.getCountSchedule(
        searchMovieid,
        searchLocation
      );
      const totalPage = Math.ceil(totalData / limit);

      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData,
      };
      const result = await scheduleModel.getAllSchedule(
        limit,
        offset,
        searchMovieid,
        searchLocation,
        sortSchedule
      );
      redis.setEx(
        `getSchedule:${JSON.stringify(req.query)}`,
        3600,
        JSON.stringify({ result, pageInfo })
      );
      return helperWrapper.response(
        res,
        200,
        "succes get data",
        result,
        pageInfo
      );
    } catch (error) {
      return helperWrapper.response(res, 400, "bad request", null);
    }
  },
  getScheduleById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await scheduleModel.getScheduleById(id);
      if (result.length <= 0) {
        return helperWrapper.response(
          res,
          404,
          `data by id ${id} not found`,
          null
        );
      }
      redis.setEx(`getSchedule:${id}`, 3600, JSON.stringify(result));
      return helperWrapper.response(res, 200, "succes get data!", result);
    } catch {
      return helperWrapper.response(res, 400, "bad request", null);
    }
  },
  createSchedule: async (req, res) => {
    try {
      const { movieid, premier, price, location, dateStart, dateEnd, time } =
        req.body;
      const setData = {
        movieid,
        premier,
        price,
        location,
        dateStart,
        dateEnd,
        time,
      };
      const result = await scheduleModel.createSchedule(setData);

      return helperWrapper.response(res, 200, "Success create data !", result);
    } catch {
      return helperWrapper.response(res, 400, "bad request", null);
    }
  },
  updateSchedule: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await scheduleModel.getScheduleById(id);
      if (checkId.length <= 0) {
        return helperWrapper.response(
          res,
          404,
          `data by id ${id} not found`,
          null
        );
      }
      const { movieid, premier, price, location, dateStart, dateEnd, time } =
        req.body;
      const setData = {
        movieid,
        premier,
        price,
        location,
        dateStart,
        dateEnd,
        time,
        updatedAt: new Date(Date.now()),
      };
      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        // console.log(data); // propertyl
        // console.log(setData[data]); // value
        if (!setData[data]) {
          delete setData[data];
        }
      }

      const result = await scheduleModel.updateSchedule(id, setData);

      return helperWrapper.response(res, 200, "Success update data !", result);
    } catch {
      return helperWrapper.response(res, 400, "bad request", null);
      // console.error();
    }
  },
  deleteSchedule: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await scheduleModel.deleteSchedule(id);
      if (result.length <= 0) {
        return helperWrapper.response(
          res,
          404,
          `data by id ${id} not found`,
          null
        );
      }

      return helperWrapper.response(res, 200, "succes delete Data", result);
    } catch {
      return helperWrapper.response(res, 400, "bad request", null);
    }
  },
};
