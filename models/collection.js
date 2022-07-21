const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { objSchema } = require("./object");


const collectionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  properties: [String],
  items: [objSchema],
});

const Collection = new mongoose.model("Collection", collectionSchema);

const validateCollection = (collection) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    properties: Joi.array().items(Joi.string()).required(),
    items: Joi.array().required(),
  });
  return schema.validate(collection);
};

module.exports.Collection = Collection;
module.exports.validateCollection = validateCollection;
module.exports.collectionSchema = collectionSchema;