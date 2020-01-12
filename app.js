var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");
var localMongoose = require("passport-local-mongoose");

require('dotenv').config()

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

// SETUP DATABASE FOR REGISTRATION:
mongoose.connect("mongodb+srv://zairzacetb:arpanet123@cluster0-coz0t.mongodb.net/test?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
//Express-Session n
app.use(require("express-session")({
  secret: "Secrets shall not be disclosed",
  resave: false,
  saveUninitialized: false
}));

const userSchema = new mongoose.Schema ({
  name: String,
  gender: String,
  email: String,
  password: String,
  phone: Number,
  college: String,
  events: [mongoose.Schema.Types.ObjectId]
});

userSchema.plugin(localMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

///////////////////////////////////////////////////
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
app.use('/', routes);
app.post("/register", function (req, res) {

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    gender: req.body.gender,
    phone: req.body.phone,
    college: req.body.college
  });

    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/");
        });
    });
});

app.post("/login", passport.authenticate("local",
{
    successRedirect: "/",
    failureRedirect: "/login"
  }),
);

app.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");

});

app.get("/admin", (req, res) => {
  res.render("adminlog");
});

app.post("/admin", (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  if(username == "zairza" && password == "database"){
    User.find({}, (err, data) => {
      if (err) console.log(err);
      else 
        // res.send(data);
        res.send(data);
    });
  } else {
    res.redirect("/admin");
  }
});

app.get('/event1/:eventID', (req, res) => {
  User.updateOne(
    {
      _id: req.user._id
    },
    {
      $push: {
        events: req.params.eventID
      }
    }
  );
});

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
