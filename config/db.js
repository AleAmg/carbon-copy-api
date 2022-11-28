require("dotenv").config();
const mongoose = require("mongoose");

const conecctionString = process.env.MONGODB_URI;

mongoose
  .connect(conecctionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
  })
  .then(() => {
    console.log("Database connected with MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
