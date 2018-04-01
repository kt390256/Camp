var express = require("express");
var Campground = require("../models/campground");
var middlewareController = require("../controller");
var Comment = require("../models/comment");

var router = express.Router();

//===============================
//COMMENTS ROUTES - NESTED ROUTE
//===============================
//show the page where to add comment(the page that has the form to add comment)
router.get("/campgrounds/:id/comments/new", middlewareController.isLoggedIn, function(req,res){
  //the very fisrt thing you have to do is to check if this route is working by manually go to the route
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    console.log("error at line 137");
}
    else {
        res.render("comments/new", {campground:campground});
    }
  })
});

//adding comments to a particular campground
router.post("/campgrounds/:id/comments",middlewareController.isLoggedIn, function(req, res){
  //lookup campground using ID
  Campground.findById(req.params.id, function(err, campground){//find the campground
    if(err)
    {
      console.log(err);
      console.log("comming from line 151");
      res.redirect("/campgrounds");
    }else{
      //create new comments
      Comment.create(req.body.comment, function(err, comment){//create a comment
        if(err)
        {
          console.log(err);
          console.log("coming from line 159");
        }//end of if
        else{
          //add username and id to comment
          comment.author.id = req.user._id;//"comment" is taken from the second param, "author" is taken from the comment schema,
                                          //and "id" is taken from insdie the author field
          comment.author.username = req.user.username;
          comment.save();//save the comment module, the module should have the content, and associated author(because we linked them up there)
          //connect new comment to campgrounds
          campground.comments.push(comment);//accessing the "comments" field insdie the campground Schema and push the new comment to it
          campground.save();//save the entire campground module
          //redirect campground show page
          //console.log(comment);
          res.redirect("/campgrounds/" + campground._id)
        }
      })//end of Comment create
  }//end of else
  })
})

//Edit comment page
router.get("/campgrounds/:id/comments/:comment_id/edit",middlewareController.checkCommentOwnership, function(req,res){

//you can grab a spcific Comment by accessing req.paras.comment_id, which returns an ID
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err){res.render("back")}
    else{
      res.render("comments/edit", {campground_id : req.params.id, comment:foundComment});
    }
  })
})

//update comment
router.put("/campgrounds/:id/comments/:comment_id", middlewareController.checkCommentOwnership,function(req,res){

    //access a particular comment, look for a specfic field(of the schema) to edit
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,updatedComment){
      if(err){res.render("back")}
      else{
        res.redirect("/campgrounds/"+ req.params.id);
      }
    })
})

router.delete("/campgrounds/:id/comments/:comment_id", middlewareController.checkCommentOwnership,function(req,res){
  Comment.findByIdAndRemove(req.params.comment_id,function(err){

    if(err){
      res.redirect("back");
    }
    else{
      res.redirect("/campgrounds/"+ req.params.id);
    }
  })
})


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("/login");
}

function checkCommentOwnerhip(req,res,next){

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
            //otherwise go back to where you came from
            res.redirect("back");

          }//end of else
        }//end of else
      })//end of findById
    }//end of if
    else{
      res.render("login");
    }
}//en of function


module.exports = router;
