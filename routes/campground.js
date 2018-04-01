var express = require('express');
var Campground = require('../models/campground');
var middlewareController = require("../controller");
var path = require('path');//use path to tell express where to store images
var formidable = require('formidable');
var fs = require ('fs');//fs can read/create/update/delete/rename files
var router = express.Router();

var uploadImage;

//==================
//CAMPGROUND ROUTES
//==================

//INDEX - show all campgrounds
router.get("/", function(req, res){

  var search = req.query.searchContent;

//console.log(req.user);    //Get all campgrounds from DB
    //.find() store everything inside the second params of the callback function
    Campground.find({}, function(err, allCampgrounds){//the first param is empty because we are not adding a particular campground
      if(err){
        console.log(err);
      }
      else{
        //conosle.log(allCampgrounds.name);
        //"camgroundsss" will be used in HTML file, allCampgrounds is the name of the second param

        //res.redirect("/results");//the following way is to render a website, and to pass info between frontend and backend
         res.render("campgrounds/index", {campgroundsss:allCampgrounds, currentUser: req.user});
        }
      }) //end of campground.find
    //
    //   if(search!==undefined){//req.query.searchContent starts off with undefined, and
    //   Campground.find( {name: new RegExp(search,"i")}, function(err,searchFound){
    //       console.log(search);
    //     if(err){console.log(err);}
    //     else{
    //       //dont
    //       //console.log(searchFound+"Coming from campground.js");
    //       module.exports.searchContent = searchFound;
    //       //console.log(searchContent);
    //       //console.log(this.search);
    //     }
    //   })
    // }//end of if
    });//end of function

      //sec param corresponding to the variable above, the first is to the html form
      //res.render("campgrounds", {campgroundsss:campgrounds});


//this is not actaully a webpage, everything inside happens when you hit the "submit" button
//even tho this post request is going to what seems to be the same URL as above, but these
//are differe routes, as one is get the other one is post
router.post("/", middlewareController.isLoggedIn, function(req, res){
  //get data from form and add to camp grounds array
  //redirect back to campgrounds page


//this will triggered when the entire request has been received, and everything has
//been finished
//===================================================================================================================================
//req.body.x is for PUT and POST request, has to do with database || req.query.search will grab x from www.something.com/?search=x
//=================================================================================================================================
  //in order to get the data from the form you have to do
  var name  = req.body.name;//grab the name from new.ejs
  var image = req.body.image;//grab the image from new.ejs
  var description = req.body.description;
  var price = req.body.price;
//  var image = targetPath;

  //I am creating an object here, everything inside the bracket is just JSON format
  /*
      This is the same as
      var author = new author();
      author.id = req.user._id
  */
  var author = {
          id: req.user._id,
          username: req.user.username
  }

  var newCamground = {name: name, image: image, description: description, author: author, price: price, uploadImage:uploadImage};
//==================
//image upload logic
//==================
//create an incoming form Object
// var form = formidable.IncomingForm();
// form.parse(req);
// //specify that we dont't want to allow the user to upload multiple files in a single request
// form.multiples = false;
// //store all uploads in the /uploads directory
// form.on('fileBegin', function(name, file){
//
//   //form.uploadDir = path.join(__dirname, '/uploads');
// 		file.path = __dirname + '/uploads/' +file.name;
//     uploadImage = file.path;
//
//     //var newCamground = {name: name, image: image, description: description, author: author, price: price, uploadImage: uploadImage};
// 	})
// //form.uploadDir = path.join(__dirname, '/uploads');
// //this form.on('file') will trigger AFTER is field/file pair has been receive
// form.on('file', function(name, file){
//
//   //fs.rename(file.path, path.join(form.uploadDir, file.name));
//   console.log("upload " + file.name);
//   //.rename(old_path, new_path)
//    //targetPath = path.join(form.uploadDir, file.name);
//   //fs.rename(file.path, targetPath);
// });
// //if error happens
// form.on('error', function(err){
//   console.log(err);
// });
// //=======================================================================================

  //this is an object that has two fields
  //console.log(req.user);//req.user contains the current logged in user info
  Campground.create(newCamground, function(err, newlyCreated){
    if(err){
      console.log(err);
    }
    else{

      console.log(newlyCreated);
      res.redirect('/campgrounds');//default is a GET request
    }
  });
});


//this /campground/new should show the form that will send the data to the POST route above
router.get("/new", middlewareController.isLoggedIn, function(req, res){
  // if(err)
  // {
  //   console.log(err);
  //   console.log("Coming from line 106");
  // }
  res.render("campgrounds/new");
})

router.get("/new/addpic", function(req, res){


  res.render("asd");
})

router.post("/new/addpic", function(req, res){

  var form = formidable.IncomingForm();
  form.parse(req);
  //specify that we dont't want to allow the user to upload multiple files in a single request
  form.multiples = false;
  //store all uploads in the /uploads directory
  form.on('fileBegin', function(name, file){

    //if you want to store static files please store them to the 'public'folder
  		file.path =  __dirname + '/../public/uploads/' +file.name;

      //then extract this path /public/uploads/ + filename
      uploadImage = '/uploads/'+ file.name;

      //var newCamground = {name: name, image: image, description: description, author: author, price: price, uploadImage: uploadImage};
  	})
  //form.uploadDir = path.join(__dirname, '/uploads');
  //this form.on('file') will trigger AFTER is field/file pair has been receive
  form.on('file', function(name, file){

    //fs.rename(file.path, path.join(form.uploadDir, file.name));
    console.log("upload " + file.name);
    console.log(uploadImage);
    //.rename(old_path, new_path)
     //targetPath = path.join(form.uploadDir, file.name);
    //fs.rename(file.path, targetPath);
  });
  //if error happens
  form.on('error', function(err){
    console.log(err);
  });
  req.flash("success", "You have uploaded an image!");
  res.redirect("/campgrounds/new");
})


//SHOW route
router.get("/:id", function(req, res){

  var n = new Date();
  var date = n.toDateString();
  //find the campground with provided ID
  var campgroundID = req.params.id;//"/:id" matches with req.params."id"
  //console.log("This is req.params : " + req.params + "\n");//returns [object object]
  //console.log("This is req.params.id : " + req.params.id);//returns an actual id : ad345kh123jhasdd some shit
  //populate(anything), this anything refers to the name of the variable inside the camegroundSchema
  //this is how you display a database object that contains another database Object

  //you first find the main Object in this case,campground from the db, then you want to find the another database section
  //by using populate(), then you want to use exec to grab the whole campground with comment db object
  Campground.findById(campgroundID).populate("comments").exec(function(err, foundCampground){
    if(err)
    {
      console.log(err);
    }
    else{
      //foundCamground grabs the specifc campground and save it to a variable name call campground, which will be used in show.ejs
      res.render("campgrounds/show", {campground: foundCampground, date: date});//first param is the same param in show.ejs campground.name
    }
  })
  //render show templarte with that campground
})//end of SHOW route

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middlewareController.checkCampgroundOwnership, function(req,res){

  //check to see if the logged in user
  // if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground){
    //this is still a get request, but when you hit submit, it becomes a PUT/DELETE
  //  if(err)
    //{
      //res.redirect("/campgrounds");
    //}else{
      //does use own campground
      //these two things are NOT the same
      //console.log(foundCampground.author.id);//this is a mongoose object
      //console.log(req.user._id);//this is a string
    //  if(foundCampground.author.id.equals(req.user.id)){
            res.render("edit", {campground: foundCampground});


  //if not, redirect
})//end of EDIT ROUTE
})

//UPDATE ROUTE
router.put("/:id", middlewareController.checkCampgroundOwnership,function(req,res){

//this function takes 3 arguments(id, newData, callBack)
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
    if(err){
      res.redirect("/campgrounds");
    }
    else{
      res.redirect("/campgrounds/"+ req.params.id);
    }
  })
})

router.delete("/:id", middlewareController.checkCampgroundOwnership,function(req,res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/campgrounds");
    }else{
      res.redirect("/campgrounds");
    }
  })
})


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("/login");
}

function checkCampgroundOwnerhip(req,res,next){

    //check to see if the use if logged in
    if(req.isAuthenticated()){
      //process if it is
      Campground.findById(req.params.id, function(err,foundCampground){
        //error?
        if(err){
          //go back to where you came from
          res.redirect("back");//back literally means go back to the previous page
        }else{
          //if user is logged in, check to see if the current campground's author id IS THE SAME as the current current user
          if(foundCampground.author.id.equals(req.user._id)){
            //if it is, proceed
            next();
          }else{
            //otherwise go back to where you came from
            res.redirect("back");

          }//end of else
        }//end of else
      })//end of findById
    }//end of if
    else{
      res.redirect("back");
    }
}//en of function


//router has declared up there
module.exports = router;//this will return all the routes

//first params matches with var name in another file
// module.exports.searchContent = searchContent;
