const db = require('../../db/queries');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const OMDB_API_KEY = process.env.OMDB_API_KEY;

const movieValidation = [
  body('movie_title')
  .trim()
  .notEmpty().withMessage('Movie title is empty')
  .customSanitizer(value => 
    value
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
  ),
  
  body('release_date')
  .notEmpty().withMessage('Release date is empty'),

  body('rating')
  .notEmpty().withMessage('Rating is empty')
  .isFloat({min: 0, max: 10}).withMessage('Rating must be number between 0 and 10'),
];

const allMoviesGet = asyncHandler(async (req, res) => {
  const movies = await db.getAllMovies();

  if (movies.length === 0) {
    return res.status(404).send('No movies found');
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

  const movieTitle = encodeURIComponent(movie.title);
  
  const apiURL = `https://www.omdbapi.com/?t=${movieTitle}&apikey=${OMDB_API_KEY}`;
  
  const response = await fetch(apiURL);
  const data = await response.json();
  movie.poster = data.Poster;

  res.render('movie', { title: `${movie.title}`, movie });
})

const movieFormGet = (req, res) => {
  res.render('movieform', { title: 'Add new movie' });
}

const movieFormPost = [
  movieValidation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render('movieform', { 
        title: 'Add new movie',
        errors: errors.array(),
        movie_title: req.body.movie_title,
        release_date: req.body.release_date,
        rating: req.body.rating,
      });
    }

    const { movie_title, release_date, rating } = req.body;
    await db.addMovie(movie_title, release_date, rating);

    res.redirect(`/movies/${movie_title}`);
  }),
];

const movieEditFormGet = async (req, res) => {
  const { movie } = req.params;
  const movieDetails = await db.movieGet(movie);
  const directors = await db.getAllDirectors();
  const formattedDate = movieDetails.release_date.toISOString().split('T')[0];

  res.render('movieeditform', { 
    title: `Edit ${movieDetails.title}`,
    movie_title: movieDetails.title,
    release_date: formattedDate,
    rating: movieDetails.rating,
    movieId: movieDetails.director.director_id,
    directors
   });
}

const movieEditDetailsPost = async (req, res) => {
  const { movie_title, release_date, rating } = req.body;
  const movieTitle = req.params.movie;

  await db.updateDetailsPost(movieTitle, movie_title, release_date, rating);
  res.redirect(`/movies/${movie_title}/edit`);
}

const movieEditDirectorPost = async (req, res) => {
  const directorId = req.body.director;
  const movie = req.params.movie;

  const director = await db.getDirectorInfo(movie);
  const movieId = await db.movieIdGet(movie);

  console.log('director id:', directorId);
  console.log('movie id: ', movieId);

  if (!director) {
    console.log('No director found');
    await db.insertDirectorPost(movieId, directorId);
  } else {
    console.log('Director found');
    // await db.updateDirectorPost(directorId);
    // also add link to a form to add a director if none in the drop down
  }
}

module.exports = { allMoviesGet, movieGet, movieFormGet, movieFormPost, movieEditFormGet, movieEditDetailsPost, movieEditDirectorPost };