const Product = require("./models/ProductModel");
const product = new Product({
  name: "kjhgj",
  metric: "hhj",
  price: 10.0,
  brandID: "6146be6f91047eed29be75cf",
  categoryIdList: "jhgfh",
  pictures: "hghfgj",
});
product.save();

console.log(product);
