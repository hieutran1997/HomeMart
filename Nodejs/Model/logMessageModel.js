var mongoose = require('mongoose');

var logMessage = new mongoose.Schema({
    Room:String,
    SendBy:String,
    DateTime:String,
    Time:String,
    Lesson:Number,
    ContentMessage:String,
    AppId:String,
    Receive:String,
    Email:String,
    Name:String,
    Status : Boolean,
    IndexMsg : Number
},{collection:'tblLogMessage'});

module.exports = logMessage;