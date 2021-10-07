const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const envData = process.env;
require("dotenv").config();
const app = express();

const adminRoutes = require("./routes/AdminRoutes");
const userRoutes = require("./routes/UserRoute");
const salesPerson = require("./routes/SalesPersonRoute");
const product = require("./routes/ProductRoute");
const brand = require("./routes/BrandRoute");
const category = require("./routes/CategoryRoute");
const warehouse = require("./routes/WarehouseRoute");
const productWarehouse = require("./routes/ProductWarehouseRoute");
const order = require("./routes/OrderRoute");

app.use(morgan("dev"));
app.use(express.json());
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/salesperson", salesPerson);
app.use("/product", product);
app.use("/brand", brand);
app.use("/category", category);
app.use("/warehouse", warehouse);
app.use("/productwarehouse", productWarehouse);
app.use("/order", order);

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
