const { Router } = require('express');
const { allMoviesGet } = require('../controllers/moviesController');

const moviesRouter = Router();

moviesRouter.get('/', allMoviesGet);

module.exports = moviesRouter;