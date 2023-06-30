const express = require('express');
const app = express();
const account = require('./routes/account');
const collections = require('./routes/collections');
const items = require('./routes/items')
require('./startup/db')();

app.use(express.json());
app.use('/api/account', account);
app.use('/api/collections', collections);
app.use('/api/:id/items', items);

const port = process.env.PORT || 3000;
app.listen(port, console.log(`Escuchando en el puerto ${port}`));