var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var routes = require("./routes/index");

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// SETUP DATABASE FOR REGISTRATION:
mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema ({
  name: String,
  gender: String,
  email: String,
  password: String,
  phone: Number,
  college: String
});

const User = new mongoose.model("User", userSchema);

///////////////////////////////////////////////////

app.post("/register", function (req, res) {

  const newUser = new User({
    name: req.body.name,
    gender: req.body.gender,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    college: req.body.college
  });

  newUser.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.render("logged");
    }
  })
});

///////////////////////////////////////////////////

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("logged");
        } else {
          res.render("error");
        }
      }
    }
  });
});

///////////////////////////////////////////////////

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
