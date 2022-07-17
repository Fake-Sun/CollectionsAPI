const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


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
