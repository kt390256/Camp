var express = require("express");
var passport = require("passport");
var User = require("../models/user");
var CampgroundRoute = require("./campground");
var Campground = require("../models/campground");
var router = express.Router();

//=======================
//Other routes/Auth route
//=======================

router.get("/", function(req, res) {
  res.render("landing");
});

router.get("/results", function(req,res){

//if you write "req.query.searchContent(searchContent is directly from html)"
//then w/e inside that you type inside that search will beomce a query
  var search = req.query.searchContent;

  if(search!==undefined){//req.query.searchContent starts off with undefined, and
  Campground.find( {name: new RegExp(search,"i")}, function(err,searchFound){
      console.log(search);
    if(err){console.log(err);}
    else{
      //dont
      console.log(searchFound+"Coming from index.js");
      res.render("search", {searchResult: searchFound, search:search});
    }
  })
}//end of if
});

//===========
//AUTH ROUTE
//==========

//show register form
router.get("/register", function(req,res){
  res.render("register");
})

router.post("/register", function(req,res){

  var newUser = new User({username:req.body.username})

//save this to "user" in the call back function
  User.register(newUser, req.body.password, function(err, user){//sign up the user
    if(err){
      console.log(err);//display err if it happenes
      return res.render("register");//end show the register page
    }//end of if
    passport.authenticate("local")(req,res,function(){//then we are going to log them in
      res.redirect("/campgrounds");
    })
  })//end of User.register
})


//login ROUTES
router.get("/login", function(req,res){
  res.render("login");//param of req.flash has the to be same as w/e the first param inside the req.flash
})

//noticed that we have passport.authenticate() up there and here,
//the difference is that in the register route, we are making a new user then log
//them in, whereas down here, in the login page, we presume that the user already exist
//then we checks everything then log them in

//passport.authenticate() is lieterally just log them in

router.post("/login", passport.authenticate("local", {
  successRedirect: "/campgrounds",
  failureRedirect: "/login"
}), function(req,res){
});


//logout routes
router.get("/logout", function(req,res){
  req.logout();
  req.flash("success", "You have logged out");
  res.redirect("/campgrounds");
})


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("/login");
}

module.exports = router;
