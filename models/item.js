const mongoose = require('mongoose');
const Joi = require('joi');
const { propertySchema, propertyValidSchema } = require('./property');

const itemSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        minlength: 3,
        maxlength: 25
    },
    description: { 
        type: String, 
        maxlength: 255 
    },
    properties:  {
        type: [propertySchema],
    }
});

const itemValidSchema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    description: Joi.string().min(3).max(255).required(),
    properties: Joi.array().items(propertyValidSchema).required().min(1),
  });

const validateItem = object => {
  return itemValidSchema.validate(object);
};

module.exports.itemSchema = itemSchema;
module.exports.validateItem = validateItem;
module.exports.itemValidSchema = itemValidSchema;