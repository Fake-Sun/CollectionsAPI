const { validateCollection, Collection } = require('../models/collection');
const express = require('express');
const authenticate = require('../middleware/authenticate');
const router = express.Router();
const verifyOwner = require('../middleware/verifyOwner');

router.get('/', verifyOwner, async (req, res) => {
    const collections = await Collection.find({ owner: req.body.owner}).sort('name');
    res.send(collections);
});

router.get('/:name', verifyOwner, async (req, res) => {
  const collections = await Collection.find({ name: req.body.name}).sort('name');
  res.send(collections);
});

router.post('/', [authenticate, verifyOwner], async (req, res) => {
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



module.exports = router;