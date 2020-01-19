var express = require("express"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    User = require("./model"),
    router = express.Router();
    
//Initialization of passportjs
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
router.use(passport.initialize());
router.use(passport.session());

router.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

router.post("/register", function (req, res) {
    const newUser = new User({
      username: req.body.username,
      name: req.body.name,
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
  
  router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) {
         return next(err); 
        }
      if (!user) {
         return res.redirect('/login'); 
        }
      req.logIn(user, function(err) {
        if (err) {
           return next(err); 
        } else {
          req.flash("success", "signed in as " + req.user.name);
          return res.redirect('/');
        }
      });
    })(req, res, next);
  });
  
  router.get("/logout", (req, res) => {
    req.logOut();
    req.flash("success", "successfully logged you out");
    res.redirect("/");
  
  });

///////////////////////////////////////////////////////////////////////
/* Backend for event registration */
router.get('/register/:eventID', (req, res) => {
	User.findOne({_id:req.user._id},(err,user)=>{
	  user.events.push(req.params.eventID)
	  user.save((err, data)=>{
		if(err) {
      console.log(err);
      res.send("F")
    }
		else { res.send("T");
	   }
	  })
	})
});

router.get('/chregister/:eventID', (req, res) => {
	var ID = req.params.eventID;
	User.findOne({_id: req.user._id}, (err,user) => {
	  if(err) console.log(err);
	  else{
		User.findOne({events: ID}, (err, found) => {
		  if(err) console.log('0');
		  else if(found) 
			res.send("T");
		  else 
			res.send("F");
		});
	  }
	});
});
  
router.get('/unregister/:eventID', (req, res) => {
	User.findOne({_id:req.user._id},(err,user)=>{
	  user.events.pull(req.params.eventID)
	  user.save((err, data)=>{
		if(err) {
      console.log(err);
      res.send("F");
    }
		else {
      res.send("T");
		}
	  })
	})
});
///////////////////////////////////////////////////////////////////////// 

module.exports = router;