var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});



router.get('/sign', function(req, res, next){
   res.render('m');
});


module.exports = router;
