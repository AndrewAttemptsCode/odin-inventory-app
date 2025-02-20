const db = require('../../db/queries');

const allGenreGet = async (req, res) => {
  const genres = await db.getAllGenres();
  res.render('genres', { title: 'All genres', genres });
}

const genreMoviesGet = async (req, res) => {
  const genre = req.params.genre;
  const movies = await db.getGenreMovies(genre);
  res.render('genre', { title: `${genre} movies`, movies })
}

module.exports = { allGenreGet, genreMoviesGet };