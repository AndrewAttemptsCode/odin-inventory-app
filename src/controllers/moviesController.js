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

  const releaseObj = new Date(movie.release_date);
  const day = releaseObj.toLocaleString('en', {weekday: 'long'});
  const date = String(releaseObj.getDate()).padStart(2, '0');
  const month = releaseObj.toLocaleString('en', {month: 'long'});
  const year = releaseObj.getFullYear();

  const formattedDate = `${day}, ${date} ${month}, ${year}`;
  movie.releaseDate = formattedDate;

  res.render('movie', { title: `${movie.title}`, movie });
})

module.exports = { allMoviesGet, movieGet };