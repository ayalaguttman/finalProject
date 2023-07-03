const mongoose =require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const {config} = require("../config/secret") 


const branchSchema = new mongoose.Schema({
  name:String,
  manager_ID:String,
  address:{
    city:String,
    street:String,
    house_number:Number
  },
  date_created:{
    type:Date , default:Date.now()
  },
  active:{
    type:Boolean, default: true,
  },
})

exports.BranchModel = mongoose.model("branches",branchSchema);

exports.validateBranch = (_reqBody) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(99).required(),
        manager_ID: Joi.string().min(2).max(99).required(),
        address: Joi.object().keys({ 
            city: Joi.string().min(2).max(99).required(),
            street:  Joi.string().min(2).max(99).required(),
            house_number: Joi.number().required()
           })
    })
    return joiSchema.validate(_reqBody);
}
