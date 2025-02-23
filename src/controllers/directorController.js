const db = require('../../db/queries');
const asyncHandler = require('express-async-handler');

const OMDB_API_KEY = process.env.OMDB_API_KEY;

const allDirectorsGet = asyncHandler(async (req, res) => {
  const directors = await db.getAllDirectors();
  
  if (directors.length === 0) {
    res.status(404).send('No directors found');
  }

  res.render('directors', { title: 'All Directors', directors });
})

const directorGet = asyncHandler(async (req, res) => {
  const directorName = req.params.director;
  const director = await db.getDirector(directorName);
  const movies = await db.getMoviesByDirector(directorName);

  if (!director) {
    return res.status(404).send(`Cannot find director: ${directorName}`);
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

  res.render('director', { title: 'Director Info', director, movies });
})

module.exports = { allDirectorsGet, directorGet };