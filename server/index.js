const express = require("express");
require("dotenv").config();
const connection = require("./config/db");
const cors = require("cors");
const app = express();
const authRouter=require("./routers/authRoute");
const cookieParser=require("cookie-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser())
const PORT = process.env.PORT || 8080;
// app.use("/", (req, res) => {
//   res.send("hello world");
// });
app.use("/api/user",authRouter)
app.use(notFound,errorHandler)
app.listen(PORT, async () => {
  try {
    await connection;
    console.log(`Server start at port no ${PORT}`);
  } catch (error) {
    console.log("Failed to connect to DB");
  }
});
