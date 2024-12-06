const catchAsync = require("../catchAsync.js");
const User = require('../models/userModel.js');
const { body, validationResult } = require('express-validator');


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