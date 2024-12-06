const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
// const passport = require('passport'); TODO
const flash = require('connect-flash');
const session = require('express-session');

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

module.exports = app;