var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var User = require("./routes/model");
var bodyParser = require("body-parser");
var flash = require("connect-flash");

require('dotenv').config()

var routes = require("./routes/index");
var handler = require("./routes/handler");

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// view engine setup
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

//Express-Session n
app.use(require("express-session")({
  secret: "Secrets shall not be disclosed",
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
app.use('/', routes);
app.use('/', handler);
///////////////////////////////////////////////////////////////////////////////

app.get('/register/:eventID', (req, res) => {
	User.findOne({_id:req.user._id},(err,user)=>{
	  user.events.push(req.params.eventID)
	  user.save((err, data)=>{
		if(err) console.log(err)
		else { res.redirect("back")
	   }
	  })
	})
});

app.get('/chregister/:eventID', (req, res) => {
	var ID = req.params.eventID;
	User.findOne({_id: req.user._id}, (err,user) => {
	  if(err) console.log(err);
	  else{
		User.findOne({events: ID}, (err, found) => {
		  if(err) console.log('0');
		  else if(found) 
			console.log("YES");
		  else 
			console.log("NO");
		  res.redirect('/');
		});
	  }
	});
});
  
app.get('/unregister/:eventID', (req, res) => {
	User.findOne({_id:req.user._id},(err,user)=>{
	  user.events.pull(req.params.eventID)
	  user.save((err, data)=>{
		if(err) console.log(err)
		else { res.redirect('back');
		}
	  })
	})
});
  
////////////////////////////////////////////////////////////////////////////////
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