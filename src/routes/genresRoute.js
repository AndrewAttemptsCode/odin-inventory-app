const { Router } = require('express');
const { allGenreGet } = require('../controllers/genresController');

const genreRouter = Router();

genreRouter.get('/', allGenreGet);

module.exports = genreRouter;