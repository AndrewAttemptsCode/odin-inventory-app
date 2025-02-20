const pool = require('./pool');

const getAllGenres = async () => {
  const { rows } = await pool.query('SELECT DISTINCT category FROM genres ORDER BY category ASC;');
  return rows;
}

module.exports = { getAllGenres };