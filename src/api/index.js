const app = require("../src/index");
const { connectMongo } = require("../src/config/db");

module.exports = async (req, res) => {
  if (!global.mongooseConnected) {
    await connectMongo();
    global.mongooseConnected = true;
  }
  return app(req, res);
};
