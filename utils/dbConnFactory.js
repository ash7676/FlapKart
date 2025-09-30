const mongoose = require("mongoose");


//------DEMONSTRATES A FACTORY FUNCTION'-------//
function createDbClient(type, ENV) {
  if (type === "mongo") {
    let MONGODB_URL = "";

    //----DYNAMIC DB SELECTION-----//
    switch (ENV) {
      case "development":
        MONGODB_URL = process.env.MONGODB_DEV;
        break;
      case "staging":
        MONGODB_URL = process.env.MONGODB_STAGING;
        break;
      case "production":
        MONGODB_URL = process.env.MONGODB_PROD;
        break;
      default:
        throw new Error("failed to config db url");
    }
    const conn = mongoose.createConnection(MONGODB_URL);
    return conn;
  }
}
module.exports = createDbClient;
