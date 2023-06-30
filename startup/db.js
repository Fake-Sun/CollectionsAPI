const config = require('config');
const db = config.get('db');
const mongoose = require('mongoose');

module.exports = function() {
    mongoose.set("strictQuery", true);
    mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Connected to DB');
}