const { validateCollection } = require('../models/collection');
const { validateItem } = require('../models/item');
const express = require('express');
const auth = require('../middleware/authenticate');
const router = express.Router();
const { Account } = require('../models/account');
const validate = require('../middleware/validate');

router.get('/', auth, async (req, res) => {
    const account = await Account.findById(req.account._id);
    if(!account) return res.status(404).send('Account does not exist.');

    const collection = account.collections.id(req.params.id);
    if (!collection) return res.status(404).send('Collection does not exist or does not belong to this account.');

    res.send(collection.items);
});

router.post('/:id/items', [auth, validate(validateItem)], async (req, res) => {
    const account = await Account.findById(req.account._id);
    if(!account) return res.status(404).send('Account does not exist.');

    const collection = account.collections.id(req.params.id);
    if (!collection) return res.status(404).send('Collection does not exist.');

    const item = req.body;

    for(itemProperty of item.properties) {
        let propertyMatch = false;
        
        for(collectionProperty of collection.properties) {
            if(collectionProperty === itemProperty.name) propertyMatch = true;
        }

        if(propertyMatch === false) {
            res.status(400).send("Item properties doesn't match the collection's properties.");
            return;
        }
    }

    collection.items.push(item);
    const savedCollection = await Account.findByIdAndUpdate(req.account._id, { collections: account.collections }, {new: true});
    res.send(savedCollection);
});

module.exports = router;
