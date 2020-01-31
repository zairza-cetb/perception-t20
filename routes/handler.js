var express = require("express"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    User = require("../models/model"),
    ResetRequest = require('../models/resetRequest'),
    router = express.Router(),
    ejs = require("ejs"),
    path = require("path"),
    nodemailer =require("nodemailer"),
    event_json=require("./events.json");

// Utility to check if a string is a valid event ID
function isValidEventID(value) {
  return (/^\d+$/.test(value)) && (event_json.hasOwnProperty(value));
}
    
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

const transporter = nodemailer.createTransport({
  service:"Gmail",
  auth:{
  type:"OAuth2",
    user:"perception.cetb@gmail.com",
    clientId: "408361162632-gh5634uanva94clel791fhsodfg4vc5g.apps.googleusercontent.com",
    clientSecret: "ZK5uE6H8vYjxMhdlAJbhq2LS",
    refreshToken: "1//04Ut61xHb3p2VCgYIARAAGAQSNwF-L9IrR2K2rhYQZhE_8tc1OjsmLbxsSBUOK1hGI0k6nLoSnFbx_wNE30kv4AtvP40IoArJxKo"
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
    User.findOne({
      username: req.body.username,
      phone: req.body.phone,
    }, (err, user) => {
      let message;
      if (err) {
        message = "Sorry, There seems to be a problem at our end";
        if (req.query.ref) {
          res.redirect(`/login?ref=${req.query.ref}&err=${message}`);
        } else {
          res.redirect(`/login?err=${message}&ref=`);
        }
      } else if (!user) {
        message = "An account with the given credentials does not exist";
        if (req.query.ref) {
          res.redirect(`/login?ref=${req.query.ref}&err=${message}`);
        } else {
          res.redirect(`/login?err=${message}&ref=`);
        }
      } else {
        // create a new password reset request
        const resetRequest = new ResetRequest({
          r_id: user._id,
        });

        // save the request to the database
        resetRequest.save((err, request) => {
          if (err) {
            message = "Sorry, There seems to be a problem at our end";
            if (req.query.ref) {
              res.redirect(`/login?ref=${req.query.ref}&err=${message}`);
            } else {
              res.redirect(`/login?err=${message}&ref=`);
            }
            return;
          }

          // Send an E-Mail with a password reset link with id of the request
          transporter.sendMail({
            from: 'Perception 2020 Team, CETB',
            to: user.username,
            subject: 'Perception 2020 | Password reset',
            text: `Hi, ${user.name}\t\nWe received a request to reset your Perception 2020 password. If this wasn't you, you can safely ignore this email, otherwise please go to the following link to reset your password:\nhttps://perception.cet.edu.in/resetpassword/${resetRequest._id}\n\nThe Perception 2020 Team`,
          }, function (error, info) {
            if (error) {
              message = "Sorry, There seems to be a problem at our end";
              if (req.query.ref) {
                res.redirect(`/login?ref=${req.query.ref}&err=${message}`);
              } else {
                res.redirect(`/login?err=${message}&ref=`);
              }
            } else {
              message = "Please check your E-Mail (also check your spam folder) for instructions on how to reset your password";
              if (req.query.ref) {
                res.redirect(`/login?ref=${req.query.ref}&message=${message}`);
              } else {
                res.redirect(`/login?message=${message}&ref=`);
              }
            }
          });
        });
      }
    });
  });

  // Reset password form posts here with new password
  router.post('/resetpassword/:resetRequestID', function(req, res, next) {
    ResetRequest.findByIdAndDelete(req.params.resetRequestID, function(requestError, resetRequest) {
      if (requestError || !resetRequest) {
        if (req.query.ref) {
          res.redirect(`/login?ref=${req.query.ref}&err=Invalid password reset link, Please go to Forgot Password to request another link`);
        } else {
          res.redirect('/login?err=Invalid password reset link, Please go to Forgot Password to request another link&ref=');
        }
      } else {
        User.findById(resetRequest.r_id, function(userError, user) {
          user.setPassword(req.body.password, function(hashingError, updatedUser) {
            if (hashingError || !updatedUser) {
              if (req.query.ref) {
                res.redirect(`/login?ref=${req.query.ref}&err=Sorry, There seems to be a problem at our end`);
              } else {
                res.redirect('/login?err=Sorry, There seems to be a problem at our end&ref=');
              }
            } else {
              updatedUser.save()
              .then(() => {
                if (req.query.ref) {
                  res.redirect(`/login?ref=${req.query.ref}&message=Your password has been successfully reset. Please login to continue`);
                } else {
                  res.redirect('/login?message=Your password has been successfully reset. Please login to continue&ref=');
                }
              })
              .catch(saveError => {
                if (req.query.ref) {
                  res.redirect(`/login?ref=${req.query.ref}&err=Sorry, There seems to be a problem at our end`);
                } else {
                  res.redirect('/login?err=Sorry, There seems to be a problem at our end&ref=');
                }
              });
            }
          });
        });
      }
    });
  });

///////////////////////////////////////////////////////////////////////
/* Backend for event registration */
router.get('/register/:eventID', (req, res) => {
  // Checks if the eventID is a valid event ID
  if (isValidEventID(req.params.eventID)) {
    User.findOne({ _id: req.user._id }, (err, user) => {
      user.events.push(req.params.eventID)
      user.save((err, data) => {
        if (err) {
          console.log(err);
          res.send("F");
        }
        else {
          res.send("T");
        }
      });
    });
  } else {
    res.statusCode = 500;
    res.send('F');
  }
});

router.get('/chregister/:eventID', (req, res) => {
  // Checks if the eventID is a valid event ID
  if (isValidEventID(req.params.eventID)) {
    var ID = req.params.eventID;
    User.findOne({ _id: req.user._id }, (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.send('F');
      }
      else {

        let found = user.events.includes(ID);
        if (found)
          res.send("T");
        else
          res.send("F");
      }
    });
  } else {
    res.statusCode = 500;
    res.send('F');
  }
});

router.get('/unregister/:eventID', (req, res) => {
  // Checks if the eventID is a valid event ID
  if (isValidEventID(req.params.eventID)) {
    User.findOne({ _id: req.user._id }, (err, user) => {
      user.events.pull(req.params.eventID)
      user.save((err, data) => {
        if (err) {
          res.statusCode = 500;
          res.send("F");
        }
        else {
          res.send("T");
        }
      });
    });
  } else {
    res.statusCode = 500;
    res.send('F');
  }
});
///////////////////////////////////////////////////////////////////////// 

module.exports = router;
