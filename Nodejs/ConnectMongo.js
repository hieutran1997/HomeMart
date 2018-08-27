//Nhập mô-đun mongoose
var mongoose = require('mongoose');
var user = require('./userModel');
//Thiết lập một kết nối mongoose mặc định
var mongoDB = 'mongodb://127.0.0.1:27017/DBIFT';
mongoose.connect(mongoDB, { useNewUrlParser: true }, function(err){
    if(err) console.log('err connect', err);
    else console.log('connected');
});

var user = new mongoose.Schema({
    _id:{type:String,required:true},
    userid:String,
    username:String,
    address:String,
    age:String,
    role:String,
},{collection:'tblUsers'});

var tblUsers = mongoose.model('tblUsers',user);

tblUsers.find().then(function(docs){
    console.log(docs);
});
