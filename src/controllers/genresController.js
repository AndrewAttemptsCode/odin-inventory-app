const db = require('../../db/queries');

const allGenreGet = async (req, res) => {
  const genres = await db.getAllGenres();
  res.render('genres', { title: 'All genres', genres });
}

module.exports = { allGenreGet };