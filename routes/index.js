var express = require('express');
var router = express.Router();

const userModel = require("./users");
const passport= require ("passport");
const localStrategy = require("passport-local");    // inn 2 line ki madad se banda login kar payega aand can use the heart of the stratergy

passport.use(new localStrategy(userModel.authenticate()));


router.get('/', function(req, res){
  res.render('index');
})


    router.get('/profile', isLoggedIn ,function(req,res){
      res.render('profile');
    });

router.post('/register',function(req,res){
  var userdata = new userModel({
    username: req.body.username,
    secret: req.body.secret
  });


userModel.register(userdata,req.body.password)     // yeh 2 line ki madad se yaha account banega 
.then(function(registereduser){
  passport.authenticate("local")(req,res,function() {    // yeh 2 line ki madad se account bante he ligin ho gaaya... jayega /profile route par
    res.redirect('/profile');
  })
})
});


router.post("/login",passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect:"/"
}) ,function(req,res){})

router.get('/logout',function(req,res,next){
  req.logout(function(err){
    if(err) {return next(err);}
    res.redirect('/');
  });
})

function isLoggedIn(req,res,next){    // This code : kya aap loggedin ho agar nhi ho vapis jaaoo "/" par
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

module.exports = router;