const config = require('config');
const db = config.get('db');
const mongoose = require('mongoose');

module.exports = function() {
    mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
    console.log('Connected to DB');
}