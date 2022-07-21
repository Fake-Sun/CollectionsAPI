const { validateCollection, Collection } = require('../models/collection');
const express = require('express');
const auth = require('../middleware/authenticate');
const router = express.Router();
const checkUser = require('../middleware/checkUser');
const { Account } = require('../models/account');

router.get('/', checkUser, async (req, res) => {
    const collection = await Collection.find({ owner: req.body.owner }).sort('name');
    res.send(collection);
});

router.post('/', [auth, checkUser], async (req, res) => {
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

router.put('/', auth, async (req, res) => {
    const { error } = validateCollection(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await Account.findById(req.user._id);
    if(!user) return res.status(404).send('Account does not exist.');

    user.collections.push(req.body);
    const savedAcc = await Account.findByIdAndUpdate(req.user._id, { collections: user.collections });
    res.send(savedAcc.collections);
});

router.put('/:id', checkUser, async (req, res) => {
    console.log(req.params.id);
    const collections = await Collection.find({ name: req.params.id }).sort('_id');
    res.send(collections);

});

module.exports = router;