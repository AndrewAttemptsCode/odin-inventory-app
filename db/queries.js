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
  const movieQuery = await pool.query(
    `SELECT id, title, release_date, rating
    FROM movies 
    WHERE title = $1;`,
    [title]
  );

  const movie = movieQuery.rows[0];

  const genreQuery = await pool.query(
    `SELECT category
    FROM genres
    WHERE movie_id = $1;`,
    [movie.id]
  );

  movie.genres = genreQuery.rows.map(row => row.category);

  return movie;
}

const getAllDirectors = async () => {
  const { rows } = await pool.query(
    `SELECT DISTINCT first_name, last_name
    FROM directors
    ORDER BY first_name ASC
    ;`
  )
  return rows;
}

const getDirector = async (directorName) => {
  const [firstName, lastName] = directorName.split(' ');

  const directorQuery = await pool.query(`
  SELECT DISTINCT d.first_name, d.last_name, g.category
  FROM directors d
  INNER JOIN movies m
  ON d.movie_id = m.id
  INNER JOIN genres g
  ON m.id = g.movie_id
  WHERE d.first_name = $1
  AND d.last_name = $2;`,
  [firstName, lastName]
  );

  if (directorQuery.rows.length === 0) {
    return null;
  }

  const director = directorQuery.rows[0];

  director.genres = directorQuery.rows.map(row => row.category);

  return director;
}

const getMoviesByDirector = async (directorName) => {
  const [firstName, lastName] = directorName.split(' ');

  const { rows } = await pool.query(`
    SELECT m.title
    from movies m
    INNER JOIN directors d
    ON m.id = d.movie_id
    WHERE d.first_name = $1
    AND d.last_name = $2;`,
    [firstName, lastName]);

  return rows;
}

module.exports = { getAllGenres, getAllMovies, getGenreMovies, movieGet, getAllDirectors, getDirector, getMoviesByDirector };


