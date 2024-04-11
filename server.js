const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan");
const cors = require("cors");
//dotenv config
dotenv.config();

//rest app
const app = express();

//database config
connectDB();

//middlewares
app.use(cors());
app.use(morgan());
app.use(express.json());

//PORT number
const PORT = 8000;

//routes
app.get("/", (req, res) => {
  res.send("This is ems backend");
});
app.use("/api/v1/user", require("./routes/authRoute.js"));

//Listening the PORT
app.listen(PORT, () => {
  console.log(`Server is running`);
});
