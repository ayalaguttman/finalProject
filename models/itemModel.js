const mongoose = require("mongoose");
const Joi = require("joi");

const itemSchema = new mongoose.Schema({
    name: String,
    info: String,
    img_url: String,
    worker_id: String,
    categories_url: String,
    price: Number,
    color: String,
    size: Number,
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
        categories_url: Joi.string().min(2).max(99).required(),
        price: Joi.number().min(2).max(99).required(),
        color: Joi.string().min(2).max(15).required(),
        min_size: Joi.number().min(2).max(99).required(),
        max_size: Joi.number().min(2).max(99).required() ,
        
    })
    return joiSchema.validate(_reqBody);
}
