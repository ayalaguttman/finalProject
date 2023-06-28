const mongoose = require("mongoose");
const Joi = require("joi");

const itemSchema = new mongoose.Schema({
    name: String,
    info: String,
    img_url: String,
    worker_id: String,
    category: String,
    price: Number,
    color: String,
    size: Number,
    min_size: Number,
    max_size: Number,
    stock_in_branches: [{
        branch_code:String,
        amount_in_stock:Number
    }],
    sale: {
        info: String,
        time_line: {
            start_date: Date,
            end_date: Date
        },
        discount_percentages: Number,
    },
    date_created:{
        type:Date , default:Date.now()
      },
    active: {
        type: Boolean, default: true
    }
})

exports.ItemModel = mongoose.model("items", itemSchema);

exports.validateItem = (_reqBody) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(99).required(),
        info: Joi.string().min(2).max(500).required(),
        img_url: Joi.string().min(2).max(200).allow(null, ""),
        category: Joi.string().min(2).max(99).required(),
        price: Joi.number().min(2).max(1000).required(),
        color: Joi.string().min(2).max(15).required(),
        min_size: Joi.number().min(1).max(60).required(),
        max_size: Joi.number().min(1).max(60).required() ,
        stock_in_branches: Joi.array().items(
            Joi.object({
                branch_code: Joi.string().min(2).max(99).required(),
                amount_in_stock: Joi.number().min(0).max(1000).required(),
            })
        ),
        sale: Joi.object().keys({
            info:Joi.string().min(2).max(99).required(),
            time_line:Joi.object().keys({
                start_date:Joi.date().min(new Date()).required(),
                end_date:Joi.date().min(new Date()).required()
            }),
            discount_percentages:Joi.number().min(0).max(1000).required()
        })
    })
    return joiSchema.validate(_reqBody);
}
