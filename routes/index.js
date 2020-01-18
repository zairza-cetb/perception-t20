var express = require('express');
var User = require("./model");
var router = express.Router();

router.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
  });

/* GET home page. */
router.get("/", function(req, res, next) {
    res.render('index');
});

/* GET register page. */
router.get("/register", function (req, res, next) {
    res.render("register");
});

/* GET login page. */
router.get("/login", function (req, res, next) {
    res.render("login");
});

<<<<<<< HEAD
router.get('/techevents', function(req, res, next){
	res.render('techevents');
});

router.get('/litevents', function(req,res,next){
	res.render('litevents');
});

router.get('/manevents', function(req,res,next){
	res.render('manaevents');
});

router.get('/flagevents', function(req,res,next){
	res.render('flasshipevents');
=======
/* GET admin page. */
router.get("/admin", (req, res) => {
	res.render("adminlog");
});

  /* GET techevents page. */
  router.get('/techevents', function(req, res, next) {
	res.render('event1');
});
/* GET litevents page. */
router.get('/litevents', function(req,res,next) {
	res.render('event2');
});
/* GET management events page. */
router.get('/manevents', function(req,res,next) {
	res.render('event3');
});
/* GET flag page. */
router.get('/flagevents', function(req,res,next) {
	res.render('event4');
>>>>>>> 6cd78de97947cada501c48f30d6c61ba76c613b2
});

/* GET comingsoon page. */
router.get('/comingsoon', function(req,res,next) {
	res.render('comingsoon');
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

  