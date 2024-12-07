const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport'); 
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const app = express();

const { ensureAuthenticated, forwardAuthenticated } = require('./auth');

const MainController = require('./controllers/mainController');
const UserRouter = require('./routes/userRouter');

require('./passport-config')(passport);


app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

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

app.use(MainController.globalFlashMiddleware);

app.get("/", forwardAuthenticated, MainController.main);

app.get('/dashboard', ensureAuthenticated, MainController.dashboard);

app.use("/users", UserRouter);

app.use(MainController.errorHandler);
app.get('*', MainController.notFound);

module.exports = app;
