const mongoose = require('mongoose');
const Joi = require('joi');

const accountSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true,
        minlength: 3,
        maxlength: 25
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 255
    },
    password: {
        type: String, 
        required: true,
        minlength: 3,
        maxlength: 255
    },
    isLogged: Boolean
});

const Account = new mongoose.model('Account', accountSchema);

function validateAccount(user) {
    const schema = Joi.object({
        username: Joi.string().min(5).max(25).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(user);
};

exports.Account = Account;
exports.validateAccount = validateAccount;