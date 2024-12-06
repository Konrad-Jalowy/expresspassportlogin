const catchAsync = require("../catchAsync.js");
const User = require('../models/userModel.js');


exports.errorHandler = (err, req, res, next) => {
    res.status(500).json({"Error": "Some kind of error occurred."});
};

