const express = require('express');
const app = express();
const myaccount = require('./routes/myaccount');
const collections = require('./routes/collections');
require('./startup/db')();

app.use(express.json());
app.use('/api/myaccount', myaccount);
app.use('/api/collections', collections);

const port = process.env.PORT || 3000;
const server = app.listen(port, console.log(`Escuchando en el puerto ${port}`))