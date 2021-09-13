const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const envData = process.env;
require("dotenv").config();
const app = express();

const adminRoutes = require("./routes/AdminRoutes");

app.use(morgan("dev"));
app.use(express.json());
app.use("/admin", adminRoutes);

mongoose
  .connect(envData.DB, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log(envData.DB);
    console.log("Mongo DB connected sucessfully ");
  })
  .catch((e) => {
    console.log("Error connecting to database", e);
  });

var project = "Enterpot";
var port = 5000;
app.listen(port, () => {
  console.log(`${project} is running at port ${port}`);
});
