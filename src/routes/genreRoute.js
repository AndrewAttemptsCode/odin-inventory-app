const { Router } = require('express');
const { allGenreGet } = require('../controllers/genreController');

const genreRouter = Router();

genreRouter.get('/', allGenreGet);

module.exports = genreRouter;