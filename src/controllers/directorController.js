const db = require('../../db/queries');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const OMDB_API_KEY = process.env.OMDB_API_KEY;

const directorValidation = [
  body('first_name')
  .trim()
  .notEmpty().withMessage('First name field is empty')
  .matches(/^[a-zA-Z]+$/).withMessage('First name should contain letters only')
  .customSanitizer(value =>
    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
  ),

  body('last_name')
  .trim()
  .notEmpty().withMessage('Last name field is empty')
  .matches(/^[a-z-A-Z]+$/).withMessage('Last name should contain letters only')
  .customSanitizer(value =>
    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
  ),

  body('bio')
  .trim()
  .notEmpty().withMessage('Bio field is empty'),

];

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

const directorFormGet = (req, res) => {
  const movieName = req.params.movie;
  res.render('directorform', { title: 'Add New Director', movieName });
}

const directorFormPost = [
  directorValidation,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render('directorform', 
        {
          title: 'Add new director',
          errors: errors.array(),
          movieName: req.body.movieName,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          bio: req.body.bio,
        });
    }

    const { first_name, last_name, bio, movieName } = req.body;
    await db.addNewDirector(first_name, last_name, bio);
    res.redirect(`/movies/${movieName}/edit`);
  }
]; 

module.exports = { allDirectorsGet, directorGet, directorFormGet, directorFormPost };