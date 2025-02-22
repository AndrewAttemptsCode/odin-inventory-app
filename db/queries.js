const pool = require('./pool');

const getAllGenres = async () => {
  const { rows } = await pool.query('SELECT DISTINCT category FROM genres ORDER BY category ASC;');
  return rows;
}

const getAllMovies = async () => {
  const { rows } = await pool.query('SELECT * FROM movies ORDER BY title ASC;');
  return rows;
}

const getGenreMovies = async (genre) => {
  const { rows } = await pool.query(
    `SELECT *
    FROM movies
    INNER JOIN genres
    ON movies.id = genres.movie_id
    WHERE genres.category = $1;`,
    [genre]
  );
  return rows;
}

const movieGet = async (title) => {
  const { rows } = await pool.query(
    `SELECT *
    FROM movies
    WHERE movies.title = $1;`,
    [title]
  );
  return rows[0];
}

module.exports = { getAllGenres, getAllMovies, getGenreMovies, movieGet };