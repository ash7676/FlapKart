const createDbClient =  require("../utils/dbConnFactory")

//-----------CREATE DB INSTANCE USING FACTORY FUNCTION----------------//
const ENV = process.env.ENV;

const db = createDbClient("mongo", ENV);
db.on("connected", () => {
  console.log("Database connected successfully..");
});
db.on("error", (err) => console.log("database connection failed!", err));

module.exports = db;