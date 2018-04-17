module.exports = function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500);
  res.json({ error: err });
};
