const express = require("express");
require("dotenv").config();
const authRoutes = require("./routes/authRouter");
const productRouter = require("./routes/productRouter");
const cartRouter = require("./routes/cartRouter");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/product", productRouter);
app.use("/cart", cartRouter);

const PORT = process.env.PORT;
const ENV = process.env.ENV;
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

//-----DATABASE CONNECTION-----//
mongoose
  .connect(MONGODB_URL)
  .then(() => console.log("database connected successfully.."))
  .catch(() => console.log("database connection failed!"));

//----GLOBAL ERROR HANDLING MIDDLEWARE-----//
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "internal server error occured",
  });
});

//-------STARTING THE APPLICATION---------//
app.listen(PORT, () => {
  console.log("application is running..");
});
