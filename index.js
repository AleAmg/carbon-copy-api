require("dotenv").config();
require("./config/db");
const express = require("express");
const morgan = require("morgan");
const routes = require("./routes");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(morgan("tiny"));

app.use(
  cors({
    origin: "*",
  })
);

app.use("/test", (req, res, next) => {
  res.send("All is OK");
});

app.use("/api", routes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("SERVER UP | Port: " + PORT, "http://localhost:3001");
});
