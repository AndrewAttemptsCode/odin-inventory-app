const express = require('express');
const path = require('path');
const indexRoute = require('./routes/indexRoute');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', indexRoute);

module.exports = app;