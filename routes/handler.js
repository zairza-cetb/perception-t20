var express = require("express"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    User = require("../models/model"),
    router = express.Router();
    
//Initialization of passportjs
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
router.use(passport.initialize());
router.use(passport.session());

router.use((req, res, next) => {
  res.locals.currentUser = req.user;
  // res.locals.message = "Registered successfully";
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
              return res.redirect(`/register?err=${err.message}`);
          }
          passport.authenticate("local")(req, res, () => {
              // res.locals.message = "Registered successfully";
              if (req.query.ref) {
                res.redirect(`${req.query.ref}?registerSuccess=1`);
              } else {
                res.redirect('/?registerSuccess=1');
              }
          });
      });
  });
  
  router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) {
         return console.log(err); 
        }
      if (!user) {
         return res.redirect(`/login?err=${info.message}`); 
        }
      req.logIn(user, function(err) {
        if (err) {
           return console.log(err); 
        } else {
          // res.locals.message = `Welcome ${user.name}`;
          if (req.query.ref) {
            return res.redirect(`${req.query.ref}?loginSuccess=1`);
          } else {
            res.redirect('/?loginSuccess=1');
          }
        }
      });
    })(req, res, next);
  });
  
  router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/?logoutSuccess=1");
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