const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


const propertySchema = new mongoose.Schema({ 
  name: { type: String, required: true},
  value: { type: String || Number, required: true }
});

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true},
  properties: [propertySchema]
})

const collectionSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true},
    owner: { type: String, required: true},
    properties: [String],
    items: [itemSchema]
});

const Collection = new mongoose.model('Collection', collectionSchema);

const validateCollection = collection => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(255).required(),
        owner: Joi.objectId().required(),
        properties: {
          name: Joi.string().min(3).max(55).required(),
          properties: {
            name: Joi.string().min(3).max(55).required(),
            value: Joi.number().string()
          }
        },
        items: Joi.array().required()
    });
    return schema.validate(collection);
};

const validateItem = collection => {
  const schema = Joi.object( )
}

module.exports.Collection = Collection;
module.exports.validateCollection = validateCollection;
module.exports.validateItem = validateItem;
