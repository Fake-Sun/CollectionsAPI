const express = require('express');
const router = express.Router();
const {Account, validateAccount} = require('../models/account');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/authenticate');
const jwt = require('jsonwebtoken');
const config = require('config');

router.get('/user', auth, async (req, res) => {
    const user = await Account.findById(req.user._id).select('-password')
    res.send(user)
});

router.post('/user', async (req, res) => {
    const { error } = validateAccount(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    let user = await Account.findOne({ email: req.body.email });
    if(user) return res.status(400).send('Email already registered.');

    user = await Account.findOne({ username: req.body.username });
    if(user) return res.status(400).send('Username already registered.');

    user = new Account(_.pick(req.body, ['username', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'username', 'email']))
})
module.exports = router;