const catchAsync = require("../catchAsync.js");
const User = require('../models/userModel.js');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcrypt');

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
    body('email').custom(async value => {
        const user = await User.findOne({email: value});
        if (user !== null) {
          throw new Error('Email already in use');
        }
      }),
];

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

exports.registerPost = catchAsync(async (req, res, next) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    let created = await User.create(
        { 
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
     });
    
    return res.status(201).redirect("/users/login");
  }
);

exports.validateAndForwardRegister = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      
      return next();
    }
    console.log(errors);
    
    req.flash('message', `Register Failed`);
    return res.redirect('/users/register');
}

exports.validateAndForwardLogin = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      
      return next();
    }
    console.log(errors);
    
    req.flash('message', `Login Failed`);
    return res.redirect('/users/login');
}

exports.logout = function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/users/login');
    })
}