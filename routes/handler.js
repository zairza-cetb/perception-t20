var express = require("express"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    User = require("../models/model"),
    router = express.Router(),
    nodemailer =require("nodemailer");
    
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

// const transporter=nodemailer.createTransport({
//   service:"gmail",
//   auth:{
//     user:"perceptioncet@gmail.com",
//     pass:"********"                                 //TODO:use the password after hosting
//   }
// });

// Ethereal email for testing nodemailer functionality
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'leanna.haag93@ethereal.email',
      pass: 'pjjZxwuBXAAs39hhsn'
  }
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
              transporter.sendMail({
                from: 'Perception 2020 Team, CETB',
                to: req.user.username,
                subject: 'Welcome to Perception 2020',
                text: `Hi, ${req.user.name}!\n\tYou have successfully registered for Perception 2020! Please visit the website for Perception 2020 to sign up for the events!\n\nThe Perception 2020 Team`  //TODO:email sending
              }, function(error, info){
                if (error) {
                  console.log("mail error",error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
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
        // console.log('hash',user.getHash());
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

  // Forgot password form posts here with username(email address) in body
  router.post('/forgotpassword', (req, res) => {
    console.log('hello there', req.body);
    User.findOne({
      username: req.body.username,
      phone: req.body.phone,
    }, (err, user) => {
      if (err) {
        console.log('pwresterr');
        // TODO: Something
      } else if (!user) {
        console.log('nousererr');
         // TODO TODO: Something
      } else {
        
        // Set the password to the new supplied password
        return user.setPassword(req.body.password, (err, user) => {
            console.log(user);
            user.save()
            if (err) {
              return res.redirect(`/login?err=${err.message}`);
            }
            // Send an E-Mail to notify a password change
            transporter.sendMail({
              from: 'Perception 2020 Team, CETB',
              to: user.username,
              subject: 'Your password has changed',
              text: `Hi, ${user.name}\n\tWe received a request to reset your Perception 2020 password. If this was you, you can safely ignore this email, otherwise please contact us immediately in order to recover your account.\n\nThe Perception 2020 Team`,
            }, function(error, info){
              if (error) {
                console.log("mail error",error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
          });
      }
    });
    if (req.query.ref) {
      return res.redirect(`/login?ref=${req.query.ref}`);
    } else {
      res.redirect('/login?ref=');
    }
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
		let found = user.events.includes(ID);
		  if(err) console.log('0');
		  else if(found) 
			res.send("T");
		  else 
			res.send("F");
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