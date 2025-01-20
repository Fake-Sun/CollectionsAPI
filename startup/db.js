const config = require('config');
const db = config.get('db');
const mongoose = require('mongoose');

module.exports = async function() {
    mongoose.set("strictQuery", true);
    try {
        await mongoose.connect(db);
        console.log('Connected to DB');
    } catch (error) {
        console.log(error);
    }
}