const mongoose =require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const {config} = require("../config/secret")
const {UserModel}=require("./userModel") 
const storageOrderSchema = new mongoose.Schema({
    
        item_id:String,
        size:Number,
        user_id:String,
        status:String,
        worker_id:String, 
      date_created:{
        type:Date , default:Date.now()
      }
})
exports.StorageOrderModel = mongoose.model("storageOrders",storageOrderSchema);

exports.validateStorageOrder = (_reqBody) => {
    let joiSchema = Joi.object({
      item_id: Joi.string().min(2).max(99).required(),
      size: Joi.number().min(1).max(60).required(),
      // user_id: Joi.string().min(2).max(99).custom(async (value, helpers) => {
      //   const user = await mongoose.model('users').findById(value);
      //   if (!user) {
      //     return helpers.message('Invalid user ID.');
      //   }
      //   return value;
      // }).allow(),
        status: Joi.string().valid(
          'Pending',
          'Accepted',
          'Cancelled',
        ).required(),
        // worker_id: Joi.string().min(2).max(99).allow()
           
    })
    return joiSchema.validate(_reqBody);
}
// 'Pending': The order has been placed but is not yet processed.
// 'Processing': The order is currently being processed.
// 'Shipped': The order has been shipped for delivery.
// 'Delivered': The order has been successfully delivered.
// 'Cancelled': The order has been cancelled.
// 'Accepted': The order has been accepted by the host or the store.
// 'Ready for Pickup': The order is ready for pickup by the customer.
// 'Picked Up': The customer has picked up the order.