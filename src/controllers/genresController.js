const db = require('../../db/queries');
const asyncHandler = require('express-async-handler');

const allGenreGet = asyncHandler(async (req, res) => {
  const genres = await db.getAllGenres();

  if (genres.length === 0) {
    return res.status(404).send('No genres found');
  }

  res.render('genres', { title: 'All genres', genres });
})

const genreMoviesGet = asyncHandler(async (req, res) => {
  const genre = req.params.genre;
  const movies = await db.getGenreMovies(genre);

  if (movies.length === 0) {
    return res.status(404).send(`Cannot find genre: ${genre}`);
  }

  res.render('genre', { title: `${genre} movies`, movies })
})

module.exports = { allGenreGet, genreMoviesGet };