var mongoose = require("mongoose");

//I am creating an object here, everything inside the bracket is just JSON format
/*
    This is the same as
    var author = new author();
    author.id = req.user._id
*/
var commentSchema = new mongoose.Schema({
  text: String,

  //Assocaiting a comment with a logged in user
  //author: String
  //IMPORTANT: YOU CAN DO THIS ONLY IN noSQL database like  Mongo
  author: {
       id: {//the following 2 lines are gonna go in the User collection and look for a user AND returns an user ID
            type: mongoose.Schema.Types.ObjectId, //type of this object
            ref: "User" //collection name, refers to the name "author"
            //just basically means, which databse do you want to associate this DB(comments) to?
            //in this case, the User collection
      },           //_id is generater by mongoDB so we can jsut use that
      username:  String   //this "username" matches with the "username" in the UserSchema
  }
});

var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
