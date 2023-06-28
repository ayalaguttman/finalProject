const mongoose = require('mongoose');
const {config} = require("../config/secret");
main().catch(err => console.log(err));


async function main() {
  await mongoose.connect(`mongodb+srv://${config.userDb}:${config.passDb}@cluster0.zr7g3qo.mongodb.net/StockXplorer`);
  console.log("mongo connect stockXplorer")
}