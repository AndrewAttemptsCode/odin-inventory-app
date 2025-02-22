const db = require('../../db/queries');
const asyncHandler = require('express-async-handler');

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

  if (!director) {
    return res.status(404).send(`Cannot find director: ${directorName}`);
  }

  res.render('director', { title: 'Director Info', director });
})

module.exports = { allDirectorsGet, directorGet };