const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { validateProperty, Property } = require('../models/object');

router.post('/properties', authenticate, async (req, res) => {
    const { error } = validateProperty(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let object = await Item.findOne(req.body);
    if(object) return res.status(400).send('Item already registered.');
    
});