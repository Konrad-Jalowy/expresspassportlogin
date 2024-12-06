exports.main = (req, res) => {
    res.render("welcome");
};

exports.globalFlashMiddleware = function(req, res, next) {
    res.locals.message = req.flash('message');
    res.locals.error = req.flash('error');
    res.locals.error_msg = req.flash('error_msg');
    next();
  }

exports.errorHandler = (err, req, res, next) => {
    res.status(500).json({"Error": "Some kind of error occurred."});
};