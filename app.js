const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport'); 
const flash = require('connect-flash');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./models/userModel');
const app = express();

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

app.get("/", (req, res) => {
    res.render("welcome");
});

app.get("/users/login", (req, res) => {
    res.render("login");
});

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
