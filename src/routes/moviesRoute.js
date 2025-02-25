const { Router } = require('express');
const { allMoviesGet, movieGet, movieFormGet, movieFormPost, movieEditFormGet } = require('../controllers/moviesController');

const moviesRouter = Router();

moviesRouter.get('/', allMoviesGet);
moviesRouter.get('/add-movie', movieFormGet);
moviesRouter.post('/add-movie', movieFormPost);
moviesRouter.get('/:movie/edit', movieEditFormGet);
moviesRouter.get('/:movie', movieGet);

module.exports = moviesRouter;