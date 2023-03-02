const express = require("express");
require("dotenv").config();
const connection = require("./config/db");
const cors = require("cors");
const app = express();
const authRouter=require("./routers/authRoute");
const productRouter=require("./routers/productRoute");
const cookieParser=require("cookie-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser())
const morgan=require("morgan");
const PORT = process.env.PORT || 8080;
// app.use("/", (req, res) => {
//   res.send("hello world");
// });
app.use(morgan('dev'))
app.use("/api/user",authRouter)
app.use("/api/product",productRouter)
app.use(notFound, errorHandler);
//app.use();
app.listen(PORT, async () => {
  try {
    await connection;
    console.log(`Server start at port no ${PORT}`);
  } catch (error) {
    console.log("Failed to connect to DB");
  }
});
