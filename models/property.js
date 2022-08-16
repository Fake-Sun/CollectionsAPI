const mongoose = require("mongoose");
const Joi = require("joi");

const propertySchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: String, required: true}
});

const Property = new mongoose.model('Property', propertySchema);


const propertyValidSchema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    value: Joi.string().min(1).max(50).required()
});

const validateProperty = (property) => {
    return propertyValidSchema.validate(property);
};

module.exports.propertySchema = propertySchema;
module.exports.Property = Property;
module.exports.validateProperty = validateProperty;
module.exports.propertyValidSchema = propertyValidSchema;