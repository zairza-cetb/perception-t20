var express = require("express"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    User = require("./model"),
    router = express.Router();

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
router.use(passport.initialize());
router.use(passport.session());

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

module.exports = router;