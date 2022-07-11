const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

// Note: Make new mongoose schema 'item', it has a property called 'properties' as collectionSchema which stores the item in [items] if properties match.

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true},
  properties: [{ propertyName: String, type: String || Number}]
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
        properties: Joi.array().items(Joi.string()).required(),
        items: Joi.array().required()
    });
    return schema.validate(collection);
};

const validateItem = collection => {
}

module.exports.Collection = Collection;
module.exports.validateCollection = validateCollection;
module.exports.validateItem = validateItem;
