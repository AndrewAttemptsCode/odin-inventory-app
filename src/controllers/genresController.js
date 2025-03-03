const db = require('../../db/queries');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const OMDB_API_KEY = process.env.OMDB_API_KEY;

const genreValidation = [
  body('genre')
  .trim()
  .notEmpty().withMessage('Genre is empty')
  .matches(/^[a-zA-Z- ]+$/).withMessage('Only letters, hyphens and spaces allowed')
  .customSanitizer(value => 
    value
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' '),
  )
];

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

const genreFormGet = (req, res) => {
  const movieName = req.params.movie;
  res.render('genreform', { title: 'Add new genre', movieName });
}

const genreFormPost = [
  genreValidation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render('genreform', 
        {
          title: 'Add new genre',
          errors: errors.array(),
          movieName: req.body.movieName,
        }
      )
    }

    const { movieName, genre } = req.body;

    const movieId = await db.movieIdGet(movieName);
    const existingGenre = await db.existingGenreGet(genre);
    
    if (existingGenre.length > 0) {
      return res.render('genreform',
        {
          title: 'Add new genre',
          errors: [{msg: 'Genre  already exists'}],
          movieName,
        });
    }

    await db.insertGenrePost(movieId, genre);
    res.redirect(`/movies/${movieName}/edit`);

})
];

module.exports = { allGenreGet, genreMoviesGet, genreFormGet, genreFormPost };