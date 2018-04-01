var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


//I am creating an object here, everything inside the bracket is just JSON format
/*
    This is the same as
    var author = new author();
    author.id = req.user._id
*/
var UserSchema = new mongoose.Schema({
    username:String,
    password:String

})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);
