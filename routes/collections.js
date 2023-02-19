const { validateCollection } = require('../models/collection');
const { validateItem } = require('../models/item');
const express = require('express');
const auth = require('../middleware/authenticate');
const router = express.Router();
const { Account } = require('../models/account');
const validate = require('../middleware/validate');

router.get('/:id', auth, async (req, res) => {
    const account = await Account.findById(req.account._id);
    if(!account) return res.status(404).send('Account does not exist.');

    const collection = account.collections.id(req.params.id);
    if (!collection) return res.status(404).send('Collection does not exist.');
    res.send(collection);
});

router.post('/', [auth, validate(validateCollection)], async (req, res) => {
    const account = await Account.findById(req.account._id);
    if(!account) return res.status(404).send('Account does not exist.');

    for(collection of account.collections) {
        if(collection.name === req.body.name) return res.status(400).send('Collection name already used.');
    }
    account.collections.push(req.body);
    const modifiedAcc = await Account.findByIdAndUpdate(req.account._id, { collections: account.collections }, {new: true});
    res.send(modifiedAcc);
});

router.put('/:id', [auth, validate(validateCollection)], async (req, res) => {
    const account = await Account.findById(req.account._id);
    if(!account) return res.status(404).send('Account does not exist.');

    const collection = account.collections.id(req.params.id);
    if (!collection) return res.status(404).send('Collection does not exist.');
    
    collection.set({
        name: req.body.name,
        properties: req.body.properties,
        items: req.body.items
    });
    await account.save();
    res.send(account);
});

router.delete("/:id", auth, async (req, res) => {
    const account = await Account.findById(req.account._id);
    if(!account) return res.status(404).send('Account does not exist.');

    const collection = account.collections.id(req.params.id);
    if (!collection) return res.status(404).send('Collection does not exist.');

    collection.remove();
    const savedAcc = await Account.findByIdAndUpdate(req.account._id, { collections: account.collections }, {new: true});
    res.send(savedAcc);
});

module.exports = router;
