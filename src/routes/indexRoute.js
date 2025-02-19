const { Router } = require('express');
const { indexGet } = require('../controllers/indexController');

const indexRoute = Router();

indexRoute.get('/', indexGet);

module.exports = indexRoute;