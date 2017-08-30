
module.exports = (req, res, next) => {
  if (req.protocol === 'https') {
      next();
  } else {
      res.redirect('https://' + req.headers.host + req.url);
  }
}
