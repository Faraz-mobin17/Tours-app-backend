const aliasTopTour = (err, req, _, next) => {
  req.query.limit = 5;
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  if (err) {
    next(err);
  }
  next();
};

export { aliasTopTour };
