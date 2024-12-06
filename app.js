const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport'); 
const flash = require('connect-flash');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./models/userModel');
const app = express();
const { body, validationResult } = require('express-validator');
const { ensureAuthenticated, forwardAuthenticated } = require('./auth');
const UserController = require('./controllers/userController');


const validateAndForward2 = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      
      return next();
    }
    console.log(errors);
    
    req.flash('message', `Register Failed`);
    return res.redirect('/');
}

const validateAndForward = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      
      return next();
    }
    console.log(errors);
    
    req.flash('message', `Login Failed`);
    return res.redirect('/');
}

require('./passport-config')(passport);


app.use(expressLayouts);
app.set('view engine', 'ejs');


app.use(express.urlencoded({ extended: true }));


app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(UserController.globalFlashMiddleware);

app.get("/", UserController.main);

app.get('/dashboard', ensureAuthenticated, UserController.dashboard);


app.get("/users/login", forwardAuthenticated, UserController.loginGet );
app.post("/users/login", forwardAuthenticated, UserController.loginValidator, validateAndForward);
app.post('/users/login', UserController.loginPost);

app.get("/users/register", UserController.registerGet);
app.post("/users/register", forwardAuthenticated, UserController.registerValidator, validateAndForward2)
app.post('/users/register', async (req, res, next) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    let created = await User.create(
        { 
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
     });
    
    return res.status(201).json({"Msg": "User registered", "User": created})
  });

module.exports = app;
