var express = require('express');
var User = require("./model");
var router = express.Router();

router.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
  });

/* GET home page. */
router.get("/", function(req, res, next) {
	let message, registered;
	if (req.query.loginSuccess == "1") {
		message = `Welcome, ${req.user.name}`;
	}
	if (req.query.registerSuccess == "1") {
		registered = true;
	}
	if (req.query.logoutSuccess == "1"){
		message = "Successfully logged you out";
	}
    res.render('index', {
		message,
		registered
	});
});

/* GET register page. */
router.get("/register", function (req, res, next) {
    res.render("register", {
		err: req.query.err
	});
});

/* GET login page. */
router.get("/login", function (req, res, next) {
    res.render("login", {
		err: req.query.err
	});
});

/* GET admin page. */
router.get("/admin", (req, res) => {
	res.render("adminlog");
});

  /* GET techevents page. */
  router.get('/techevents', function(req, res, next) {
	res.render('techevents');
});
/* GET litevents page. */
router.get('/litevents', function(req,res,next) {
	res.render('litevents');
});
/* GET management events page. */
router.get('/manevents', function(req,res,next) {
	res.render('manaevents');
});
/* GET flag page. */
router.get('/flagevents', function(req,res,next) {
	res.render('flagshipevents');
});

/* GET comingsoon page. */
router.get('/comingsoon', function(req,res,next) {
	res.render('comingsoon');
});


router.get('/profile', function(req,res,next) {
	res.render('profile');
});


/* POST admin page. */
router.post("/admin", (req, res) => {
	var username = req.body.username;
	var password = req.body.password;
	if(username.hashCode() == -709387849 && password.hashCode() == 1789464955){
	  User.find({}, (err, data) => {
		if (err) console.log(err);
		else 
		  res.render("data", { data: data });
	  });
	} else {
	  res.redirect("/admin");
	}
});

/* Hash function */
String.prototype.hashCode = function(){
	var hash = 0;
	 if (this.length == 0) return hash;
	 for (i = 0; i < this.length; i++) {
		 char = this.charCodeAt(i);
		 hash = ((hash<<5)-hash)+char;
		 hash = hash & hash; // Convert to 32bit integer
	 }
	 return hash;
 }

module.exports = router;

  