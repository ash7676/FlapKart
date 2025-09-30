const express = require("express");
require("dotenv").config();
const authRoutes = require("./routes/authRouter");
const productRouter = require("./routes/productRouter");
const cartRouter = require("./routes/cartRouter");
const orderRouter = require("./routes/orderRouter");
const { loggerMiddleware } = require("./middlewares/loggerMiddleware");
const app = express();
require("./utils/db")

app.use(express.json());
app.use(loggerMiddleware);

app.use("/auth", authRoutes);
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);

const PORT = process.env.PORT;

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
