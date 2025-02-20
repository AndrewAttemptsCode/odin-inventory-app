const db = require('../../db/queries');

const allMoviesGet = async (req, res) => {
  const movies = await db.getAllMovies();
  res.render('movies', { title: 'All movies', movies });
}

const movieGet = async (req, res) => {
  const title = req.params.movie;
  const movie = await db.movieGet(title);
  res.render('movie', { title: `${title}`, movie });
}

module.exports = { allMoviesGet, movieGet };