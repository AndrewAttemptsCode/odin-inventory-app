const db = require('../../db/queries');
const asyncHandler = require('express-async-handler');

const allMoviesGet = asyncHandler(async (req, res) => {
  const movies = await db.getAllMovies();

  if (movies.length === 0) {
    return res.status(404).send('No movies found');
  }

  res.render('movies', { title: 'Movies', movies });
})

const movieGet = asyncHandler(async (req, res) => {
  const title = req.params.movie;
  const movie = await db.movieGet(title);

  if (!movie) {
    return res.status(404).send(`Cannot find movie: ${title}`);
  }

  res.render('movie', { title: `${movie.title}`, movie });
})

module.exports = { allMoviesGet, movieGet };