const express = require('express');
const router = express.Router();
const {Account, validateAccount} = require('../models/account');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/authenticate');
const jwt = require('jsonwebtoken');
const config = require('config');

router.get('/', auth, async (req, res) => {
    const account = await Account.findById(req.account._id).select('-password');
    res.send(account);
});

// get auth token with username, this is for development only and HAS to be deleted before deployment for obvious security reasons.

router.get('/:username', async (req, res) => {
    const account = await Account.findOne({ username: req.params.username});
    if(!account) return res.status(404).send('Username does not exist.');

    const token = jwt.sign({ _id: account._id }, config.get('jwtPrivateKey'));
    res.send(token);
});

router.post('/', async (req, res) => {
    const { error } = validateAccount(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    let email = await Account.findOne({ email: req.body.email });
    if (email) return res.status(400).send('Email already registered.');

    let account = await Account.findOne({ username: req.body.username });
    if (account) return res.status(400).send('Username already registered.');

    account = new Account(_.pick(req.body, ['username', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    account.password = await bcrypt.hash(account.password, salt);
    await account.save();

    
    const token = jwt.sign({ _id: account._id }, config.get('jwtPrivateKey'));
    res.header('x-auth-token', token).send(_.pick(account, ['_id', 'username', 'email', 'collections']));
});


router.delete('/', auth, async (req, res) => {
    const account = await Account.findByIdAndRemove(req.account._id);
    if(!account) return res.status(404).send('Account not found');
    res.send(account);
});

module.exports = router;