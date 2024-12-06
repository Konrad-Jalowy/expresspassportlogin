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