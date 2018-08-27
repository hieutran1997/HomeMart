var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var mongoDB = 'mongodb://127.0.0.1:27017/DBCHAT';
var user = require('./Model/userModel');
var logMessage = require('./Model/logMessageModel');

var listUser = [{}];
var listUserInApp = [{}];
var listMessage = [{}];

var connected = false;

var tblUsers = mongoose.model('tblUsers',user);
var logMessageModel = mongoose.model('tblLogMessage',logMessage);

mongoose.connect(mongoDB, { useNewUrlParser: true }, function(err){
    if(err) {
        console.log('err connect', err);
        connected = fasle;
    }
    else {
        connected = true;
        console.log('connected');
    };
});

//end connect

app.get('/', function(req, res){
});

io.on('connection', function(socket){
    var objExist = {};
    socket.on('joinGroup',function(data){
        socket.join(data.groupName);
        socket.UserName = data.userName;
       
        var dateString = convertDateNow();
        //get all message in room
        //get user by username 
        if(connected){
            logMessageModel.find({DateTime :dateString,Room :data.groupName,AppId : data.appid}).then(function(docs){
                if(docs){
                    listMessage = docs;
                    io.sockets.in(obj.room).emit('response-message-old',listMessage);
                }
            });
            tblUsers.findOne({userid : data.userName,AppId : data.appid}).then(function(docs){
                objExist = docs;
            });
        }
        if(objExist !=null){
            var obj = {
                'id' : socket.id,
                'username':socket.UserName,
                'room':data.groupName
            }
            if(listUser.length >0 ){
                var index,index2= 0;
                listUser.forEach(function(item){
                    if(item.username === obj.username){
                        var objResponse = {
                            'socket': item.id,
                            'message' : 'Có người đăng nhập vào tài khoản này !'
                        }
                        io.sockets.in(obj.room).emit('response-duplicate-login',objResponse);
                        index2 = index;
                    }
                    index++;
                  });
                listUser.splice(index2,1);
                listUser.push(obj);
            }
            else{
                listUser.push(obj);
            }
            io.sockets.in(obj.room).emit('response-listuser-online',listUser);
        }
        else{
            var obj = {
                'message' : 'Tài khoản chưa được đăng ký vui lòng liên hệ ban quản trị !'
            }
            socket.emit('error-pass', obj);
        }

    });
    //sự kiện disconnect 
    socket.on('disconnect', function () { 
        var j = -1;
        for(var i =0 ; i < listUser.length ; i ++){
            if(listUser[i].id === socket.id){
                j = i;
            }
        }
		console.log(listUser[j]);
        listUser.splice(j,1);
    });

    socket.on('taoroom',function(data){
        
    });

    socket.on('send-data-to-group',function(data){
		var d = new Date();
		//data.time = d.getHours() + d.getMinutes() + d.getSeconds();
        io.sockets.in(data.groupName).emit('response-message-person',data);
        var messageModel = new logMessageModel({
            Room:data.groupName,
            SendBy:data.userName,
            DateTime:convertDateNow(),
            Time:convertDateNowToHour(),
            Lesson:data.lesson,
            ContentMessage:data.message,
            AppId:data.appid,
            Receive :'',
            Email: '',
        });
        //save message to db
        if(connected){
            messageModel.save(function(err){
                if(err){
                    console.log(err);
                }
            });
        }
    });
    socket.on('typingMessage',function(data){
        io.sockets.in(data.groupName).emit('response-typing',data);
    });
    socket.on('endtypingMessage',function(data){
        io.sockets.in(data.groupName).emit('response-end-typing',data);
    });
    
    socket.on('send-message-person',function(data){
        var d = new Date();
        socket.UserName = data.Name;
        data.time = d.getHours() + d.getMinutes() + d.getSeconds();
        var object={
            username: data.Name,
            id : socket.id,
            appid : data.AppId
        }
        listUserInApp.push(object);
        console.log(listUserInApp);
        listUserInApp.forEach(function(obj){
            if(data.Receive === obj.username && data.AppId === obj.appid){
                var dto ={
                    sendBy : data.SendBy,
                    contentMessage : data.ContentMessage,
                    time : convertDateNowToHour(),
                    datetime : convertDateNow(),
                    id : obj.id
                }
                console.log(dto);
                io.to(obj.id).emit('response-message-person',dto);
            }
        });
        //io.sockets.in(data.groupName).emit('response-message',data);
        var messageModel = new logMessageModel({
            Room:'',
            SendBy:data.Name,
            DateTime:convertDateNow(),
            Time:convertDateNowToHour(),
            Lesson:'',
            ContentMessage:data.ContentMessage,
            AppId:data.AppId,
            Receive :data.Receive,
            Email: data.Email,
            Status: false
        });
        if(connected){
            messageModel.save(function(err){
                console.log('save success !');
                if(err){
                    console.log(err);
                }
            });
        }
    });
});

function convertDateNow(){
    var date = new Date();
    return date.getFullYear() +'-'+ (date.getMonth() +1)+'-'+date.getDate();
}

function convertDateNowToHour(){
    var date = new Date();
    return date.getHours() +':'+date.getMinutes();
}

http.listen(3000, function(){
 // console.log('listening on *:3000');
});