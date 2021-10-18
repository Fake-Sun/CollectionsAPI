const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


const collectionSchema = new mongoose.Schema({
    name: { type: String, required: true},
    owner: { type: String, required: true},
    properties: [String],
    items: [itemSchema]
});

const collectionPropertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  dataType: { type: String || Number, required: true}
})

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  properties: [itemPropertySchema]
})

const itemPropertySchema = new mongoose.Schema({ 
  name: { type: String, required: true},
  value: { type: String || Number, required: true }
});


const Collection = new mongoose.model('Collection', collectionSchema);

const validateCollection = collection => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(255).required(),
        owner: Joi.objectId().required(),
        properties: Joi.array().items(Joi.string()),
        items: Joi.array()
    });
    return schema.validate(collection);
};

const validateItem = item => {
  const schema = Joi.object({
      name: Joi.string().min(3).max(255).required(),
      properties: Joi.array()
  })
}

module.exports.Collection = Collection;
module.exports.validateCollection = validateCollection;
module.exports.validateItem = validateItem;
