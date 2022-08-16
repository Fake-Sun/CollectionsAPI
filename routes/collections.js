const { validateCollection, Collection } = require('../models/collection');
const { validateItem, Item } = require('../models/item');
const express = require('express');
const auth = require('../middleware/authenticate');
const router = express.Router();
const { Account } = require('../models/account');
const mongoose = require('mongoose');

router.get('/:id', auth, async (req, res) => {
    const account = await Account.findById(req.user._id);
    if(!account) return res.status(404).send('Account does not exist.');

    const collection = account.collections.id(req.params.id);
    if(!collection) return res.status(404).send('Collection does not exist.');

    res.send(collection);
});

router.post('/', auth, async (req, res) => {
    const { error } = validateCollection(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    const user = await Account.findById(req.user._id);
    if(!user) return res.status(404).send('Account does not exist.');

    for(collection of user.collections) {
        if(collection.name === req.body.name) return res.status(400).send('Collection name already used.');
    }
    user.collections.push(req.body);
    const savedCollection = await Account.findByIdAndUpdate(req.user._id, { collections: user.collections }, {new: true});
    res.send(savedCollection);
});

router.put('/', auth, async (req, res) => {
    const { error } = validateCollection(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await Account.findById(req.user._id);
    if(!user) return res.status(404).send('Account does not exist.');

    user.collections.push(req.body);
    const savedAcc = await Account.findById(req.user._id).collections;
    res.send(savedAcc);
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validateCollection(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const account = await Account.findById(req.user._id);
    if (!account) return res.status(404).send('Account does not exist.');

    const collection = account.collections.id(req.params.id);
    if (!collection) return res.status(404).send('Collection does not exist.');


    const savedAcc = await Account.findByIdAndUpdate(req.user._id, { 
        collections: {
            name: req.body.name,
            properties: req.body.properties
        }}, {new: true});

    res.send(savedAcc);
});

router.delete("/:id", auth, async (req, res) => {

    const user = await Account.findById(req.user._id);
    if(!user) return res.status(404).send('Account does not exist.');

    const collection = user.collections.id(req.params.id);
    if(!collection) return res.status(404).send('Collection for deletion does not exist.');

    collection.remove();
    const savedAcc = await Account.findByIdAndUpdate(req.user._id, { collections: user.collections }, {new: true});
    res.send(savedAcc);
});

// Items API

router.get('/:id/items', auth, async (req, res) => {
    
    const collectionId = req.params.id;
    let collection = await Collection.findById(collectionId);
    if(!collection) return res.status(404).send('Collection does not exist.');

    res.send(collection.items);
});

module.exports = router;