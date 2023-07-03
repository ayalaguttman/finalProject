const indexR = require("./index");
const usersR = require("./users");
const itemsR = require("./items");
 const branchOrdersR=require("./branchOrders");
 const branchesR=require("./branches");
 const storageOrders=require("./storage_orders")

exports.routesInit = (app) => {
  app.use("/",indexR);
  app.use("/users",usersR);
  app.use("/items",itemsR);
 app.use("/branchOrders",branchOrdersR);
  app.use("/branches", branchesR);
  app.use("/storageOrders",storageOrders);

}