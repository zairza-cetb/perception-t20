var express = require('express');
var User = require("./model");
var router = express.Router();

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

/* GET admin page. */
router.get("/admin", (req, res) => {
	res.render("adminlog");
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
    
router.get('/techevents', function(req, res, next) {
	res.render('event1');
});

router.get('/litevents', function(req,res,next) {
	res.render('event2');
});

router.get('/manevents', function(req,res,next) {
	res.render('event3');
});

router.get('/flagevents', function(req,res,next) {
	res.render('event4');
});

router.get('/comingsoon', function(req,res,next) {
	res.render('comingsoon');
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

  