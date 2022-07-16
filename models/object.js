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
    
});