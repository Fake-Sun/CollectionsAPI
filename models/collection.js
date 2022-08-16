const mongoose = require("mongoose");
const Joi = require("joi");
const { itemSchema, itemValidSchema } = require("./item");
const { propertySchema, propertyValidSchema} = require('./property');


const collectionSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    properties: [propertySchema],
    items: [itemSchema]
});

const Collection = new mongoose.model("Collection", collectionSchema);

const validateCollection = (collection) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    properties: Joi.array().required().min(1).items(propertyValidSchema),
    items: Joi.array().min(1).items(itemValidSchema)
  });
  return schema.validate(collection);
};

module.exports.Collection = Collection;
module.exports.validateCollection = validateCollection;
module.exports.collectionSchema = collectionSchema;