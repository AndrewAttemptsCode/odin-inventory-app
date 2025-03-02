const { Router } = require('express');
const { allMoviesGet, movieGet, movieFormGet, movieFormPost, movieEditFormGet, movieEditDetailsPost, movieEditDirectorPost, movieEditGenresPost } = require('../controllers/moviesController');

const moviesRouter = Router();

moviesRouter.get('/', allMoviesGet);
moviesRouter.get('/add-movie', movieFormGet);
moviesRouter.post('/add-movie', movieFormPost);
moviesRouter.get('/:movie/edit', movieEditFormGet);
moviesRouter.post('/:movie/edit/details', movieEditDetailsPost);
moviesRouter.post('/:movie/edit/director', movieEditDirectorPost);
moviesRouter.post('/:movie/edit/genres', movieEditGenresPost);
moviesRouter.get('/:movie', movieGet);

module.exports = moviesRouter;