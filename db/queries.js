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

  const directorQuery = await pool.query(
    `SELECT di.first_name, di.last_name, d.director_id
    FROM directors_info di
    INNER JOIN directors d
    ON d.director_id = di.id
    WHERE d.movie_id = $1;`,
    [movie.id]
  );

  movie.director = directorQuery.rows[0] || null;
  movie.genres = genreQuery.rows.map(row => row.category) || null;

  return movie;
}

const getAllDirectors = async () => {
  const { rows } = await pool.query(
    `SELECT id, first_name, last_name
    FROM directors_info
    ORDER BY first_name ASC
    ;`
  )
  return rows;
}

const getDirector = async (directorName) => {
  const [firstName, lastName] = directorName.split(' ');

  const directorQuery = await pool.query(`
  SELECT di.id, di.first_name, di.last_name, g.category, di.bio
  FROM directors_info di
  INNER JOIN directors d
  ON di.id = d.director_id
  INNER JOIN movies m
  ON d.movie_id = m.id
  INNER JOIN genres g
  ON m.id = g.movie_id
  WHERE di.first_name = $1
  AND di.last_name = $2
  GROUP BY g.category, di.id, di.first_name, di.last_name;`,
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
    INNER JOIN directors_info di
    ON d.director_id = di.id
    WHERE di.first_name = $1
    AND di.last_name = $2;`,
    [firstName, lastName]);

  return rows;
}

const addMovie = async (title, release_date, rating) => {
  await pool.query(`
    INSERT INTO movies (title, release_date, rating)
    VALUES ($1, $2, $3)
    ;`,
    [title, release_date, rating]
  );
}

const updateDetailsPost = async (movieTitle, movie_title, release_date, rating) => {
  await pool.query(`
    UPDATE movies
    SET title = $1, release_date = $2, rating = $3
    WHERE title = $4
    ;`,
    [movie_title, release_date, rating, movieTitle]
  );
}

const getDirectorInfo = async (movie) => {
  const director = await pool.query(`
    SELECT d.id, d.movie_id, d.director_id
    FROM directors d
    INNER JOIN movies m
    ON m.id = d.movie_id
    WHERE m.title = $1;
    `, [movie]
    );
    
  return director.rows[0];
}

const movieIdGet = async (title) => {
    const movieQuery = await pool.query(
    `SELECT id
    FROM movies 
    WHERE title = $1;`,
    [title]
  );

  return movieQuery.rows[0].id;
}

const insertDirectorPost = async (movieId, directorId) => {
  await pool.query(`
    INSERT INTO directors (movie_id, director_id)
    VALUES ($1, $2);
    `, [movieId, directorId]
    );
}

const updateDirectorPost = async (movieId, directorId, id) => {
  await pool.query(`
    UPDATE directors
    SET movie_id = $1, director_id = $2
    WHERE id = $3;
    `, [movieId, directorId, id]
    );
}

const addNewDirector = async (firstName, lastName, bio) => {
  await pool.query(`
    INSERT INTO directors_info (first_name, last_name, bio)
    VALUES ($1, $2, $3);
    `, [firstName, lastName, bio]
  );
}

const movieByGenre = async (movieId) => {
  const { rows } = await pool.query(`
    SELECT id, movie_id, category
    FROM genres
    WHERE movie_id = $1;
    `, [movieId]
  );
  return rows;
}

const removeMovieGenresPost = async (movieId) => {
  await pool.query(`
    DELETE FROM genres
    WHERE movie_id = $1;
    `, [movieId]
  );
}

const updateMovieGenresPost = async (movieId, genres) => {
  for (const genre of genres) {
    await pool.query(`
      INSERT INTO genres (movie_id, category)
      VALUES ($1, $2);
      `, [movieId, genre]
    );
  }
}

const insertGenrePost = async (movieId, genre) => {
  await pool.query(`
    INSERT INTO genres (movie_id, category)
    VALUES ($1, $2);
    `, [movieId, genre]
  );
}

module.exports = { getAllGenres, getAllMovies, getGenreMovies, movieGet, getAllDirectors, getDirector, getMoviesByDirector, addMovie, updateDetailsPost, getDirectorInfo, insertDirectorPost, movieIdGet, updateDirectorPost, addNewDirector, movieByGenre, removeMovieGenresPost, updateMovieGenresPost, insertGenrePost };


