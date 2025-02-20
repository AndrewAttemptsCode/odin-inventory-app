const express = require('express');
const path = require('path');
const indexRoute = require('./routes/indexRoute');
const moviesRouter = require('./routes/moviesRoute');
const directorsRouter = require('./routes/directorRoute');
const genresRouter = require('./routes/genresRoute');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', indexRoute);
app.use('/movies', moviesRouter);
app.use('/directors', directorsRouter);
app.use('/genres', genresRouter);

module.exports = app;