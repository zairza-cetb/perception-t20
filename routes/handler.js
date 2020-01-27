var express = require("express"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    User = require("../models/model"),
    ResetRequest = require('../models/resetRequest'),
    router = express.Router(),
    ejs = require("ejs"),
    path = require("path"),
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

const transporter=nodemailer.createTransport({
  service:"gmail",
  auth:{
    user:"perceptioncet@gmail.com",
    pass:"Perceptioncet20"                                 //TODO:use the password after hosting
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
              ejs.renderFile(__dirname+"/mailTemplate.ejs", {name: req.user.name, pid: req.user.uid}, (err, data) => {
                if (err) {
                  console.log(err)
                }
                // res.locals.message = "Registered successfully";
                transporter.sendMail({
                  from: 'Perception 2020 Team, CETB',
                  to: req.user.username,
                  subject: 'Perception 2020 | Registration Successful',
                  attachments: [
                    {
                      filename: "Perception.png",
                      path: path.join(__dirname, "..", "public/assets/img/Perception.png"),
                      cid:"logo"
                    }
                  ],
                  html: data
                }, function(error, info){
                  if (error) {
                    console.log("mail error",error);
                  } else {
                    console.log('Email sent: ' + info.response);
                  }
                });
              })
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

  // Forgot password form posts here with username(email address) and phone number in body
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
        // TODO TODO: Something more
      } else {
        // create a new password reset request
        const resetRequest = new ResetRequest({
          r_id: user._id,
        });

        // save the request to the database
        resetRequest.save((err, request) => {
          console.log(request);
          if (err) {
            // TODO TODO TODO : Handle error in saving request
            return;
          }

          // Send an E-Mail with a password reset link with id of the request
          transporter.sendMail({
            from: 'Perception 2020 Team, CETB',
            to: user.username,
            subject: 'Your password has changed',
            text: `Hi, ${user.name}\n\tWe received a request to reset your Perception 2020 password. If this wasn't you, you can safely ignore this email, otherwise please go to the following link to reset your password:\nhttps://perception.cet.edu.in/resetpassword/${resetRequest._id}\n\nThe Perception 2020 Team`,
          }, function (error, info) {
            if (error) {
              console.log("mail error", error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        });
      }
    });
    if (req.query.ref) {
      res.redirect(`/login?ref=${req.query.ref}&message=Please check your email inbox for resetting your password`);
    } else {
      res.redirect('/login?message=Please check your email inbox for resetting your password&ref=');
    }
  });

  // Reset password form posts here with new password
  router.post('/resetpassword/:resetRequestID', function(req, res) {
    ResetRequest.findByIdAndDelete(req.params.resetRequestID, function(requestError, resetRequest) {
      if (requestError || !resetRequest) {
        //TODO: Handle resetRequest not found
        console.log('reset request error', requestError);
      } else {
        User.findById(resetRequest.r_id, function(userError, user) {
          user.setPassword(req.body.password, function(hashingError, updatedUser) {
            if (hashingError || !updatedUser) {
              // TODO: Handle hashing errors
              console.log('hashing errors', hashingError);
            } else {
              updatedUser.save().catch(saveError => {
                console.log('saving error', saveError);
                // TODO: Handle saving error
              });
            }
          });
        });
      }
    });
    if (req.query.ref) {
      res.redirect(`/login?ref=${req.query.ref}`);
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
