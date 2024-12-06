const catchAsync = require("../catchAsync.js");
const User = require('../models/userModel.js');
const { body, validationResult } = require('express-validator');
const passport = require('passport');

exports.errorHandler = (err, req, res, next) => {
    res.status(500).json({"Error": "Some kind of error occurred."});
};



exports.loginValidator = [
    body('email', 'Please enter an email').isEmail().trim(),
    body('password', 'Please enter password').not().isEmpty(),
    body('email').custom(async value => {
        const user = await User.findOne({email: value});
        if (user === null) {
          throw new Error('User doesnt exist');
        }
      }),
];

exports.registerValidator = [
    body('email', 'Please enter an email').isEmail().trim(),
    body('password', 'Please enter password').not().isEmpty(),
    body('password2', 'Please enter confirm password').not().isEmpty(),
    body('name', 'Please enter name').not().isEmpty(),
    body('password').custom((value, { req }) => {
        if (value !== req.body.password2) {
          throw new Error('Password confirmation is incorrect');
        }
        return true;
      }),
];

exports.main = (req, res) => {
    res.render("welcome");
};

exports.dashboard = (req, res) => {
    console.log(req.user)
    res.render('dashboard', {
      user: req.user
    })
}

exports.loginGet = (req, res) => {
    res.render("login");
};

exports.registerGet = (req, res) => {
    res.render("register");
};

exports.loginPost = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
      })(req, res, next);
  };

exports.globalFlashMiddleware = function(req, res, next) {
    res.locals.message = req.flash('message');
    res.locals.error = req.flash('error');
    res.locals.error_msg = req.flash('error_msg');
    next();
  }