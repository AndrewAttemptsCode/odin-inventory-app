const { Router } = require('express');
const { allMoviesGet, movieGet } = require('../controllers/moviesController');

const moviesRouter = Router();

moviesRouter.get('/', allMoviesGet);
moviesRouter.get('/:movie', movieGet);

module.exports = moviesRouter;