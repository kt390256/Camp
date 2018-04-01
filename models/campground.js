var mongoose = require("mongoose");

//schema
var campgroundSchema = new mongoose.Schema({

//regular schema
  name: String,
  image: String,
  description: String,
  price : String,
  uploadImage: String,
  author:{
    id:{
          type:mongoose.Schema.Types.ObjectId,
          ref: "User"
    },
    username :String
  },

//connecting to another database
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Comment"//name of collection, //collection name, refers to the name "comments"
                  //just basically means, which databse do you want to associate this DB(campground) to?
                  //in this case, the Comment collection
    }
  ]
});

//Schema to model
//make a collection cal campground
var Campground = mongoose.model("Campground", campgroundSchema);

//if you dont do this, in your app.js when u require it, you will get an empty
//object
module.exports = Campground;//exportt this model
