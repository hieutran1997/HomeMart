var mongoose = require('mongoose');

var user = new mongoose.Schema({
    _id:{type:String,required:true},
    userid:String,
    username:String,
    address:String,
    age:Number,
    role:String,
    AppId:String
},{collection:'tblUsers'});


module.exports = user;