const { validateCollection } = require('../models/collection');
const { validateItem } = require('../models/item');
const express = require('express');
const auth = require('../middleware/authenticate');
const router = express.Router({ mergeParams: true});
const { Account } = require('../models/account');
const validate = require('../middleware/validate');

router.get('/', auth, async (req, res) => {
    const account = await Account.findById(req.account._id);
    if(!account) return res.status(404).send('Account does not exist.');

    const collection = account.collections.id(req.params.id);
    if (!collection) return res.status(404).send('Collection does not exist or does not belong to this account.');

    res.send(collection.items);
});

router.post('/', [auth, validate(validateItem)], async (req, res) => {
    const account = await Account.findById(req.account._id);
    if(!account) return res.status(404).send('Account does not exist.');

    const collection = account.collections.id(req.params.id);
    if (!collection) return res.status(404).send('Collection does not exist.');

    
    for(itemProperty of req.body.properties) {
        let propertyMatch = false;
        
        for(collectionProperty of collection.properties) {
            if(collectionProperty === itemProperty.name) propertyMatch = true;  
        }

        if(propertyMatch === false) {
            res.status(400).send("Item properties doesn't match the collection's properties.");
            return;
        }
    }

    collection.items.push(req.body);
    const savedCollection = await Account.findByIdAndUpdate(req.account._id, { collections: account.collections }, {new: true});
    res.send(savedCollection);
});

router.delete('/:itemId', auth, async (req, res) => {
    const account = await Account.findById(req.account._id);
    if(!account) return res.status(404).send('Account does not exist.');

    const collection = account.collections.id(req.params.id);
    if (!collection) return res.status(404).send('Collection does not exist.');

    const item = collection.items.id(req.params.itemId);
    if(!item) return res.status(404).send('Item does not exist or ID is incorrect');

    item.remove();
    const savedAcc = await Account.findByIdAndUpdate(req.account._id, { collections: account.collections }, {new: true});
    res.send(savedAcc);
});

module.exports = router;
