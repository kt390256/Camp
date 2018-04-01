
//The purpose of this file is to.....
/*
  1.Delete what we orginally have in the DB
  2.Add some new stuffs into our database


*/


var mongoose = require("mongoose");
var Campground = require("./models/campground");//grabbing the Campground model from db so we can do sth with it
var Comment = require("./models/comment");//grabbing the Commnent model so we can do something with it

var data =[

  {name: "something new",
  image: "https://static.pexels.com/photos/247600/pexels-photo-247600.jpeg",
  description: "Lorem ipsum dolor sit amet, vix ne percipit quaestio salutatus, vel homero cetero vidisse id. Nec no quod dolorem corrumpit, offendit conceptam in qui. Cibo minim fastidii ex sed. Eum no tantas putant prodesset. Vix in tollit efficiendi, pro veri lobortis sententiae te."
  },

  {name: "something new1",
  image: "https://image.dhgate.com/0x0/f2/albu/g5/M01/0F/48/rBVaI1i2mwGAUQP-AAMD2Gl7t4s811.jpg",
  description: "Lorem ipsum dolor sit amet, vix ne percipit quaestio salutatus, vel homero cetero vidisse id. Nec no quod dolorem corrumpit, offendit conceptam in qui. Cibo minim fastidii ex sed. Eum no tantas putant prodesset. Vix in tollit efficiendi, pro veri lobortis sententiae te."
  },

  {name: "Nice butt",
  image: "https://ae01.alicdn.com/kf/HTB1epGFNVXXXXXcXpXXq6xXFXXXN/Low-Waist-Leggings-Women-Sexy-Hip-Push-Up-Pants-Legging-Jegging-Gothic-Leggins-Jeggings-Legins-2016.jpg",
  description: "Lorem ipsum dolor sit amet, vix ne percipit quaestio salutatus, vel homero cetero vidisse id. Nec no quod dolorem corrumpit, offendit conceptam in qui. Cibo minim fastidii ex sed. Eum no tantas putant prodesset. Vix in tollit efficiendi, pro veri lobortis sententiae te."
  }

]

function seedDB(){

//Remove all campground
  Campground.remove({}, function(err){//first param is empty because we are removing everyting instead of just a particular one

    // if(err)//if error happens
    // {
    //   console.log(err);//display it
    // }
    // else//if not
    // console.log("removed everything");//.remove()executed successfully
    //
    // data.forEach(function(seed){//"for each item inside "data(defined up there)", add it to the campground DB under the name "seed"
    //
    // Campground.create(seed, function(err, campground){//created a camground under the name "seed"
    //   //when the compiler at this line, a new campgournd has already created
    //   if(err){console.log(err);}
    //   else{//if no error, create a comment
    //     console.log("added a campground");//campground created
    //
    //     //now we add new comments to the Comment collection
    //     Comment.create({
    //       text:"Greate place",
    //       author: "Ayee"
    //   }, function(err, comment){//then store the comment into the second argument
    //     campground.comments.push(comment);//push the comment into the comments array exists inside the campground schema
    //     campground.save();//save this particular campgound
    //     console.log("Created new comment");
    //   });//end of function(err, comment)
    //   }//end of else
    // });//for each object insdie the array, make one
    // })
  })

//Add bunch of campground

}


module.exports = seedDB;
