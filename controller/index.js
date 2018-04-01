//all middleware goes here
var middlewareObj = {};
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");

middlewareObj.checkCampgroundOwnership = function(req,res,next){

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


middlewareObj.checkCommentOwnership = function(req, res, next){

    //check to see if the use if logged in
    if(req.isAuthenticated()){
      //process if it is
      Comment.findById(req.params.comment_id, function(err,foundComment){
        //error?
        if(err){
          //go back to where you came from
          res.redirect("back");//back literally means go back to the previous page
        }else{
          //if user is logged in, check to see if the current campground's author id IS THE SAME as the current current user
          if(foundComment.author.id.equals(req.user._id)){
            //if it is, proceed
            next();
          }else{
          	req.flash("error", "You don't have permission to do that!")
            //otherwise go back to where you came from
            res.redirect("back");

          }//end of else
        }//end of else
      })//end of findById
    }//end of if
    else{
    	req.flash("error", "You need to be logged in to do this!");
      res.render("login");
    }
}//en of function


middlewareObj.isLoggedIn = function(req, res, next){

	
    if(req.isAuthenticated()){
      return next();
    }
    //flash message goes before it redirect, VERY IMAPORTANT
    req.flash("error", "LOGIN!!");//this won't display until the next ting we see, in this case
    											//we will see the message in the /login page, then we have to
    											//go inside the /login route and pass this "flash" to a variable
    res.redirect("/login");

}






//first way of doing a controller
// middlewareObj.checkCommentOwnership = function(){

// }

module.exports = middlewareObj;

//second way of doing a controller
// module.exports = {

// 	//all shits go in here

// }