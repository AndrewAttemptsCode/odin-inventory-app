const db = require('../../db/queries');
const asyncHandler = require('express-async-handler');

const OMDB_API_KEY = process.env.OMDB_API_KEY;

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

  await Promise.all(
    movies.map(async (movie) => {
      const movieTitle = encodeURIComponent(movie.title);
      const apiURL = `https://www.omdbapi.com/?t=${movieTitle}&apikey=${OMDB_API_KEY}`;
      const response = await fetch(apiURL);
      const data = await response.json();
      movie.poster = data.Poster;
    })
  )

  res.render('genre', { title: `${genre} movies`, movies })
})

module.exports = { allGenreGet, genreMoviesGet };