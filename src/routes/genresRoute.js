const { Router } = require('express');
const { allGenreGet, genreMoviesGet } = require('../controllers/genresController');

const genreRouter = Router();

genreRouter.get('/', allGenreGet);
genreRouter.get('/:genre', genreMoviesGet);

module.exports = genreRouter;