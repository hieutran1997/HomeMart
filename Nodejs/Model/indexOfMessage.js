var mongoose = require('mongoose');

var indexOfMessage = new mongoose.Schema({
    Room:String,
    Index_Last:Number,
    AppId:String,
},{collection:'tblIndexOfMessage'});

module.exports = indexOfMessage;