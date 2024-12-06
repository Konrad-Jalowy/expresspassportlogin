const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport'); 
const flash = require('connect-flash');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./models/userModel');
const app = express();
const { body, validationResult } = require('express-validator');

const loginValidator = [
    body('email', 'Please enter an email').isEmail().trim(),
    body('password', 'Please enter password').not().isEmpty(),
    body('email').custom(async value => {
        const user = await User.findOne({email: value});
        if (user === null) {
          throw new Error('User doesnt exist');
        }
      }),
];


const registerValidator = [
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

app.use(function(req, res, next) {
    res.locals.message = req.flash('message');
    res.locals.error = req.flash('error');
    next();
  });

app.get("/", (req, res) => {
    res.render("welcome");
});


app.get("/users/login", (req, res) => {
    res.render("login");
});
app.post("/users/login", loginValidator, validateAndForward);
app.post('/users/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
      })(req, res, next);
  });

app.get("/users/register", (req, res) => {
    res.render("register");
});
app.post("/users/register", registerValidator, validateAndForward2)
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
