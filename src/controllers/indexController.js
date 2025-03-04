const indexGet = (req, res) => {
  res.render('homepage', { title: 'Movies Inventory' });
}

module.exports = { indexGet };