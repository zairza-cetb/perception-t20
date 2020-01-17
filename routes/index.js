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
});


router.get('/comingsoon', function(req,res,next){
	res.render('comingsoon');
});

module.exports = router;
