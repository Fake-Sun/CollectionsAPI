const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { validateObject, Item } = require('../models/object');

router.post('/objects', authenticate, async (req, res) => {
    const { error } = validateObject(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let object = await Item.findOne(req.body);
    if(object) return res.status(400).send('Item already registered.');
    
});