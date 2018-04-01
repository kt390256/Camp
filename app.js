

//If you require a folder, and these is an index file inside, then this require
//will directly grab the index file.


var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require("body-parser");//to grab stuffs from HTML(like user input)
var mongoose = require('mongoose');
var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var methodOverride = require("method-override");//need to install for PUT and DELETE
var flash = require('connect-flash');

var campgroundRoute = require("./routes/campground");
var commentRoute = require("./routes/comments");
var indexRoute = require("./routes/index");


var seedDB = require("./seed.js");//script

//flash a message
//THIS LINE MUST COMES BEFORE YOUR PASSPORT CONFIGURATION
app.use(flash());
//in order to handle POST request you have to use body Parser
//body-parser extract the entire body portion of an incoming request stream
//and exposes it on req.body
app.use(methodOverride("_method"));
//seedDB();//this will run everytime we start the server
app.use(bodyParser.urlencoded({extended: true}));//bodyParser only handles JSON and urlencoded form submission
app.set("view engine", "ejs");
//__dirname refers to the directory that this script is running
//liek this /home/csc415/Desktop/App/YelpCamp, this is __dirname
app.use(express.static(__dirname + "/public"));//connect "public" folder to this app
//Connecting to db
//mongoose.connect("mongodb://localhost/yelpcamp");
mongoose.connect('mongodb://kt390256:password@ds119044.mlab.com:19044/temp')
//mongodb://<dbuser>:<dbpassword>@ds119044.mlab.com:19044/temp
//PASSWORD CONFIGURATION
app.use(require("express-session")({
  secret: "something",
  //the following options are something we have to add
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
//for the LocalStrategy, use the following version of authenticate
//.authenticate() is coming from passportLocalMongoose
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//this is the middleware will run in every route
app.use(function(req,res,next){
  //res.locals.currentUser refers to the variable "currentUser" in my HTML
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});



//===================
//ROUTES FROM /routes
//===================
app.use(indexRoute);
//append "/campgrounds" in front of all the routes in side this file
app.use("/campgrounds", campgroundRoute);
app.use(commentRoute);
// //schema
// var campgroundSchema = new mongoose.Schema({
//
//   name: String,
//   image: String,
//   description: String
// });
//
// //Schema to model
// //make a collection cal campground
// var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//
//   name: "Whatever Creek",
//   image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/White_rock_creek_dallas_county_texas.JPG/1200px-White_rock_creek_dallas_county_texas.JPG"
//
// }, function(err, campground){
//   if(err){
//     console.log(err);
//   }
//   else {
//     console.log(campground);
//   }
// })
//
// var campgrounds = [
//   {name: "Salmon Creek", image: "https://cdn1.thehunt.com/app/public/system/zine_images/867940/zine_view_thumb/e9d80a630cb3c66878bfc660faa020d9.jpg"},//url goes here
//   {name: "Granite Creek", image: "http://www.bluemaize.net/im/pants/butt-yoga-pants-4.jpg"},
//   {name: "Montana Creek", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTADkxJO0f5Pmx0QD2ouK_LKR1534je84B41S1kehRfjkRLj3Gi"}
// ];



app.listen(process.env.PORT || 3000, process.env.IP, function(){
  console.log("Server started!");
});
