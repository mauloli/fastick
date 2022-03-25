module.exports = {
  response: (res, stat, msg, data, pagination) => {
    const result = {
      stat: stat || 200,
      msg,
      data,
      pagination,
    };
    return res.status(result.stat).json(result);
  },
};
