const { createClient } = require("redis");

const client = createClient({
  // host: process.env.REDIS_HOST,
  // port: process.env.REDIS_PORT,
  // password: process.env.REDIS_PW,
  url: `redis://:${process.env.REDIS_PW}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

(async () => {
  client.connect();
  client.on("connect", () => {
    // eslint-disable-next-line no-console
    console.log("You're now connected db redis ...");
  });
})();

module.exports = client;
