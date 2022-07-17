const mongoose = require('mongoose');
const Joi = require('joi');

const objectSchema = new mongoose.Schema({
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

const Object = new mongoose.Model('Object', objectSchema);

const validateObject = object => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    description: Joi.string().min(3).max(255).required(),
    properties: Joi.array().items(Joi.string()).required(),
  });
  return schema.validate(object);
};

