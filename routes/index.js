var express = require('express');
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
    res.render('index', );
});

router.get("/register", function (req, res, next) {
    res.render("register");
});

router.get("/login", function (req, res, next) {
    res.render("login");
});

router.get('/techevents', function(req, res, next){
	res.render('event1');
});

router.get('/litevents', function(req,res,next){
	res.render('event2');
});

router.get('/manevents', function(req,res,next){
	res.render('event3');
});

router.get('/comingsoon', function(req,res,next){
	res.render('comingsoon');
});

// router.post("/admin", (req, res) => {
// 	console.log("hi2");
// 	var username = req.body.username;
// 	var password = req.body.password;
// 	if(username == "zairza" && password == "database"){
// 	  User.find({}, (err, data) => {
// 		console.log("hi1");

// 		if (err) console.log(err);
// 		else {
// 			console.log("hi");
// 		  res.send(data);}
// 	  });
// 	} else {
// 	  res.redirect("/admin");
// 	}
//   });

module.exports = router;
