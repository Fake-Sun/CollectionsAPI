const express = require('express');
const router = express.Router();
const {Account, validateAccount} = require('../models/account');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/authenticate');
const jwt = require('jsonwebtoken');
const config = require('config');

router.get('/myaccount', auth, async (req, res) => {
    const user = await Account.findById(req.user._id).select('-password');
    res.send(user);
});

router.post('/', async (req, res) => {
    const { error } = validateAccount(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    let email = await Account.findOne({ email: req.body.email });
    if (email) return res.status(400).send('Email already registered.');

    let user = await Account.findOne({ username: req.body.username });
    if (user) return res.status(400).send('Username already registered.');

    user = new Account(_.pick(req.body, ['username', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'username', 'email', 'collections']));
});

router.delete('/', auth, async (req, res) => {
    const user = await Account.findByIdAndRemove(req.user._id);
    if(!user) return res.status(404).send('Account not found');
    res.send(user);
});

module.exports = router;