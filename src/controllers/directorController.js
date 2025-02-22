const db = require('../../db/queries');
const asyncHandler = require('express-async-handler');

const allDirectorsGet = asyncHandler(async (req, res) => {
  const directors = await db.getAllDirectors();
  
  if (directors.length === 0) {
    res.status(404).send('No directors found');
  }

  res.render('directors', { title: 'All Directors', directors });
})

module.exports = { allDirectorsGet };