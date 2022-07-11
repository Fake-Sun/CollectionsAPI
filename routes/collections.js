const { validateCollection, Collection } = require('../models/collection');
const express = require('express');
const authenticate = require('../middleware/authenticate');
const router = express.Router();
const setOwner = require('../middleware/setOwner');

router.get('/', setOwner, async (req, res) => {
    const collections = await Collection.find({ owner: req.body.owner}).sort('name');
    res.send(collections);
});

router.post('/', [authenticate, setOwner], async (req, res) => {
    const { error } = validateCollection(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const collection = new Collection(req.body);
        await collection.save();
        res.send(collection);
    } catch (error) {
        await res.status(400).send(error.message);
    }
});

router.put('/:name', setOwner, async (req, res) => {
    const collections = await Collection.find({ name: req.body.name}).sort('name');
    res.send(collections);
});

module.exports = router;