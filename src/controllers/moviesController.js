const db = require('../../db/queries');

const allMoviesGet = async (req, res) => {
  const movies = await db.getAllMovies();
  res.render('movies', { title: 'All movies', movies });
}

module.exports = { allMoviesGet };