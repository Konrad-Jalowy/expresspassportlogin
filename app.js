const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
// const passport = require('passport'); TODO
const flash = require('connect-flash');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./models/userModel');
const app = express();

// Passport Config Add Here

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

// Passport middleware add here

app.use(flash());

app.get("/", (req, res) => {
    res.render("welcome");
});

app.get("/users/login", (req, res) => {
    res.render("login");
});

app.post('/users/login', (req, res, next) => {
    //passport to be added here
    return res.json({"body": req.body});
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
