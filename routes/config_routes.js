const indexR = require("./index");
const usersR = require("./users");
const itemesR = require("./items");

exports.routesInit = (app) => {
  app.use("/",indexR);
  app.use("/users",usersR);
  app.use("/items",itemesR);
}