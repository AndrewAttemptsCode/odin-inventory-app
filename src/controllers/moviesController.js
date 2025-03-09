const db = require('../../db/queries');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const OMDB_API_KEY = process.env.OMDB_API_KEY;

const defaultPoster = '/no_image_available.png'; 

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

  body('summary')
  .trim()
  .notEmpty().withMessage('Summary is empty'),
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
      movie.poster = data.Poster || defaultPoster;
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
  movie.poster = data.Poster || defaultPoster;

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
        summary: req.body.summary,
      });
    }

    const { movie_title, release_date, rating, summary } = req.body;
    await db.addMovie(movie_title, release_date, rating, summary);

    res.redirect(`/movies/${movie_title}`);
  }),
];

const movieEditFormGet = async (req, res) => {
  const { movie } = req.params;
  const movieDetails = await db.movieGet(movie);
  const directors = await db.getAllDirectors();
  const genres = await db.getAllGenres();
  const selectedGenres = await db.movieGet(movie);
  const formattedDate = movieDetails.release_date.toISOString().split('T')[0];

  res.render('movieeditform', { 
    title: `Edit ${movieDetails.title}`,
    movie_title: movieDetails.title,
    release_date: formattedDate,
    rating: movieDetails.rating,
    summary: movieDetails.summary,
    movieId: movieDetails.director ? movieDetails.director.director_id : null,
    directors,
    genres,
    selectedGenres: selectedGenres.genres ? selectedGenres.genres : null,
   });
}

const movieEditDetailsPost = async (req, res) => {
  const { movie_title, release_date, rating, summary } = req.body;
  const movieTitle = req.params.movie;

  await db.updateDetailsPost(movieTitle, movie_title, release_date, rating, summary);
  res.redirect(`/movies/${movie_title}/edit`);
}

const movieEditDirectorPost = async (req, res) => {
  const directorId = req.body.director;
  const movieTitle = req.params.movie;

  const director = await db.getDirectorInfo(movieTitle);
  const movieId = await db.movieIdGet(movieTitle);

  if (!director) {
    await db.insertDirectorPost(movieId, directorId);
  } else {
    await db.updateDirectorPost(movieId, directorId, director.id);
  }

  res.redirect(`/movies/${movieTitle}/edit`);
}

const movieEditGenresPost = async (req, res) => {
  const genres = [].concat(req.body.genres).filter(Boolean);
  const movieTitle = req.params.movie;
  const movieId = await db.movieIdGet(movieTitle);
  const existingMovieGenre = await db.movieByGenre(movieId);

  if (genres.length === 0) {
    return res.status(400).send('No genres set.');
  }

  if (existingMovieGenre) {
    await db.removeMovieGenresPost(movieId, genres);
  }
  
  await db.updateMovieGenresPost(movieId, genres);
  res.redirect(`/movies/${movieTitle}/edit`);
}

module.exports = { allMoviesGet, movieGet, movieFormGet, movieFormPost, movieEditFormGet, movieEditDetailsPost, movieEditDirectorPost, movieEditGenresPost };