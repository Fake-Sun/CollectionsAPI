const mongoose = require('mongoose');
const Joi = require('joi');

const objSchema = new mongoose.Schema({
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
    properties: [{ 
      type: String, 
      minlength: 3,
      maxlength: 25
  }]
});

const Item = new mongoose.model('Item', objSchema);

const validateObject = object => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    description: Joi.string().min(3).max(255).required(),
    properties: Joi.array().items(Joi.string()).required(),
  });
  return schema.validate(object);
};

module.exports.Item = Item;
module.exports.objSchema = objSchema;
module.exports.validateObject = validateObject;