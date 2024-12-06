const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { forwardAuthenticated } = require('../auth');

router.get("/login", forwardAuthenticated, UserController.loginGet );
router.post("/login", forwardAuthenticated, UserController.loginValidator, UserController.validateAndForwardLogin);
router.post('/login', UserController.loginPost);

router.get("/register", forwardAuthenticated, UserController.registerGet);
router.post("/register", forwardAuthenticated, UserController.registerValidator, UserController.validateAndForwardRegister)
router.post('/register', UserController.registerPost );

router.post('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/users/login');
    });
  });

module.exports = router;