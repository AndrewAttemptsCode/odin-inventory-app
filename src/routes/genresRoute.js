const { Router } = require('express');
const { allGenreGet, genreMoviesGet, genreFormGet, genreFormPost } = require('../controllers/genresController');

const genreRouter = Router();

genreRouter.get('/', allGenreGet);
genreRouter.get('/:movie/add-genre', genreFormGet);
genreRouter.post('/:movie/add-genre', genreFormPost);
genreRouter.get('/:genre', genreMoviesGet);

module.exports = genreRouter;