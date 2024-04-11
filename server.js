const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");

//dotenv config
dotenv.config();

//rest app
const app = express();

//middlewares
app.use(cors());
app.use(morgan());
app.use(express.json());

//routes
app.get("/", (req, res) => {
  res.send("Hello welcome to my world");
});

//PORT number
const PORT = 8000;

//Listening the PORT
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
