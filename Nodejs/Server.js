var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var mongoDB = 'mongodb://127.0.0.1:27017/DBCHAT';
var user = require('./Model/userModel');
var logMessage = require('./Model/logMessageModel');
var indexOfMessage = require('./Model/indexOfMessage');

var listUser = [];
var listUserInApp = [];
var listUserCSKH = [];
var listUserEmployees = [];
var listMessage = [];
var connected = false;

var tblUsers = mongoose.model('tblUsers',user);
var logMessageModel = mongoose.model('tblLogMessage',logMessage);
var indexOfMessageModel = mongoose.model('tblIndexOfMessage',indexOfMessage);

mongoose.connect(mongoDB, { useNewUrlParser: true }, function(err){
    if(err) {
        console.log('err connect', err);
        connected = fasle;
    }
    else {
        connected = true;
        console.log('connected');
        // logMessageModel.aggregate([
        //     { $group : { _id : '$Receive', data: { $push: "$$ROOT" } }},
        //     { $limit : 5 },
        //     { $match :{ _id : "cskh" }}
        // ]).then(function(data){
        //     dataTemp = data;
        //     return res.send(dataTemp);
        // });
    };
});

//end connect

app.get('/', function(req, res){
    //  logMessageModel.find({$or:[ {'Receive':'cskh' , 'AppId':'BTSOFT','SendBy':'01646060889'}, {'Receive':'01646060889' , 'AppId':'BTSOFT','SendBy':'cskh'}]}).then(function(data){
    //      return res.send(data);
    //  });
    // logMessageModel.aggregate([
    //     { $match :{ Receive : 'cskh' , AppId :'BTSOFT'}},
    //     { $group : { _id : '$SendBy', data: { $push: "$$ROOT" } }},
    //     { $limit : 10 }
    // ]).then(function(data){
    //     console.log(data);
    //     return res.send(data);
    // });
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
        //console.log('dis',socket.id);
        var j = -1;
        for(var i =0 ; i < listUser.length ; i ++){
            if(listUser[i].id === socket.id){
                j = i;
                listUser.splice(j,1);
                break;
            }
        }
        for(var i =0 ; i < listUserInApp.length ; i ++){
            if(listUserInApp[i].id === socket.id){
                j = i;
                listUserInApp.splice(j,1);
                break;
            }
        }
        for(var i =0 ; i < listUserCSKH.length ; i ++){
            if(listUserCSKH[i].id === socket.id){
                j = i;
                listUserCSKH.splice(j,1);
                break;
            }
        }
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

    //Bán hàng
    socket.on('custommer-join-web-size',function(req){
        if(listUserInApp){
            var object={
                username: req.UserName,
                id : socket.id,
                appid : req.AppId
            }
            listUserInApp.push(object);
            var objectResult = [];
          
            if(listUserInApp.length > 0 ){
                listUserInApp.forEach(function(obj){
                    if(obj.appid === req.AppId){
                        objectResult.push(obj);
                    }
                });
                listUserCSKH.forEach(function(obj){
                    if(obj.AppId === req.AppId){
                        io.to(obj.id).emit('response-get-list-custom-online',objectResult);
                    }
                })
            }
        }
        if(listUserCSKH.length>0){
            socket.emit('check-cskh-online',true);
        }
        else{
            socket.emit('check-cskh-online',false);
        }
    });
    //Khách hàng nt đến cskh
    socket.on('send-message-person',function(data){
        var d = new Date();
        var dto;
        socket.UserName = data.Name;
        data.time = d.getHours() + d.getMinutes() + d.getSeconds();
        //Th người dùng k có tk
        // var object={
        //     username: data.Name,
        //     id : socket.id,
        //     appid : data.AppId
        // }
        // listUserInApp.push(object);
        //console.log(listUserInApp);
        //Nếu cskh đang online thì gửi
        if(listUserCSKH){
            listUserCSKH.forEach(function(obj){
                dto ={
                    SendBy : data.SendBy,
                    ContentMessage : data.ContentMessage,
                    Time : convertDateNowToHour(),
                    DateTime : convertDateNow(),
                    Id : socket.id,
                    Receive : 'cskh'
                }
                io.to(obj.id).emit('request-message-person',dto);
            });
        }
        var room = 'cskh,'+data.Name;
        indexOfMessageModel.findOne({Room : room,AppId : data.AppId}).then(function(docs){
            var index = 0;
            if(docs){//nếu đã có room thì update index
                docs.Index_Last += 1;
                index = docs.Index_Last;
                docs.save(function(err){
                    console.log(err);
                });
            }else{ // chưa có thì tạo room
                var room = 'cskh,'+data.Name;
                var indexOfMessageInsert = new indexOfMessageModel({
                    Room : room,
                    Index_Last : 1,
                    AppId : data.AppId
                });
                index = 1;
                indexOfMessageInsert.save(function(err){
                    console.log(err);
                });
            }
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
                Status: false,
                IndexMsg : index
            });
            if(connected){
                messageModel.save(function(err){
                    if(err){
                        var responseStatus = {
                            status : false,
                            message : 'Không lưu được tin nhắn'
                        }
                        socket.emit('sended',responseStatus);
                        console.log(err);
                    }
                    else{
                        var responseStatus = {
                            status : true,
                            message : 'Đã gửi'
                        }
                        socket.emit('sended',responseStatus);
                        //io.to(socket.id).emit('sennded',responseStatus);
                        console.log('save success !');
                    }
                });
            }
        });
    });
    socket.on('cskh-connected',function(data){
        var obj = {
            id : socket.id,
            AppId : data.AppId
        };
        listUserCSKH.push(obj);
        getMessageNotSeen(data).then(function(count){
            socket.emit('count-message-not-seen', count);
        });
        var objectResult = [];
        if(listUserInApp.length > 0 ){
            listUserInApp.forEach(function(obj){
                io.to(obj.id).emit('check-cskh-online',true);
                if(obj.appid === data.AppId){
                    objectResult.push(obj);
                }
            });
            socket.emit('response-get-list-custom-online',objectResult);
        }
    });
    socket.on('get-message',function(data){
        getAllMessageForAdminSocket(data).then(function(docs){
           socket.emit('response-get-message',docs);
        });
    });
    socket.on('select-message-by-name',function(data){
        if(data){
            updatedSeenMessage(data.Name, data.AppId , data.CSKH,socket);
            
            listUserCSKH.forEach(function(obj){
                io.to(obj.id).emit('response-update-status',true);
            });
            getMessageOfCustomSend(data.Name,data.CSKH,data.AppId).then(function(res){
                socket.emit('response-select-message-by-name',res);
            });
        }
    });
    socket.on('reply-message-custommer',function(data){
        for(var i =0 ; i < listUserInApp.length ; i ++){
            if(listUserInApp[i].username === data.Receive){
                io.to(listUserInApp[i].id).emit('send-reply-message-custommer',data);
            }
        }
        var room = 'cskh,'+data.Receive;
        indexOfMessageModel.findOne({Room : room,AppId : data.AppId}).then(function(docs){
            var index = 0;
            if(docs){//nếu đã có room thì update index
                docs.Index_Last += 1;
                index = docs.Index_Last;
                docs.save(function(err){
                    console.log(err);
                });
            }else{ // chưa có thì tạo room
                var indexOfMessageInsert = new indexOfMessageModel({
                    Room : room,
                    Index_Last : 1,
                    AppId : data.AppId
                });
                index = 1;
                indexOfMessageInsert.save(function(err){
                    console.log(err);
                });
            }
            var messageModel = new logMessageModel({
                Room:'',
                SendBy:data.SendBy,
                DateTime:convertDateNow(),
                Time:convertDateNowToHour(),
                Lesson:'',
                ContentMessage:data.ContentMessage,
                AppId:data.AppId,
                Receive :data.Receive,
                Email: '',
                Status: false,
                IndexMsg : index
            });
            if(connected){
                messageModel.save(function(err){
                    if(err){
                        var responseStatus = {
                            status : false,
                            message : 'Không lưu được tin nhắn'
                        }
                        socket.emit('sended',responseStatus);
                        console.log(err);
                    }
                    else{
                        var responseStatus = {
                            status : true,
                            message : 'Đã gửi'
                        }
                        socket.emit('sended',responseStatus);
                        //io.to(socket.id).emit('sennded',responseStatus);
                        console.log('save success !');
                    }
                });
            }
        });
    });
    socket.on('get-message-not-seen',function(data){
        logMessageModel.countDocuments({ AppId: data.AppId, Receive: data.Receive,SendBy:data.SendBy , Status: false}).then(function(result){
            socket.emit('response-get-message-not-seen',result);
        });
    });
    socket.on('update-seen-message',function(data){
        logMessageModel.find({AppId : data.AppId , SendBy:'cskh',Receive:data.Username , Status: false}).then(function(messages){
            messages.forEach(function(obj){
                obj.Status = true;
                obj.save(function(err){
                    console.log(err);
                });
            })
        });
    }); 
    socket.on('get-all-message-for-custommer',function(data){
        getMessageOfCustomSend(data.Custommer,data.CSKH,data.AppId).then(function(docs){
            socket.emit('response-get-all-message-for-custommer',docs);
        });
    });
    socket.on('emit-check-out',function(appid){
        listUserCSKH.forEach(function(obj){
            if(obj.AppId === appid){
                io.to(obj.id).emit('response-emit-check-out',true);
            }
        })
        listUserEmployees.forEach(function(obj){
            if(obj.AppId === appid){
                io.to(obj.id).emit('response-emit-check-out',true);
            }
        })
    })
    socket.on('employee-connected',function(data){
        var obj = {
            id : socket.id,
            AppId : data.AppId
        };
        listUserEmployees.push(obj);
    });
    socket.on('typing-message-customer',function(data){
        if(listUserCSKH.length > 0){
            listUserCSKH.forEach(function(obj){
                if(obj.AppId == data.AppId){
                    io.to(obj.id).emit('custom-is-typing',data);
                }
            })
        }
    });
    socket.on('typing-message-cskh',function(data){
        listUserInApp.forEach(function(obj){
            if(obj.appid == data.AppId && obj.username==data.UserName){
                io.to(obj.id).emit('cskh-is-typing',data);
            }
        });
    });
    socket.on('end-typing-message-cskh',function(data){
        listUserInApp.forEach(function(obj){
            if(obj.appid == data.AppId && obj.username==data.UserName){
                io.to(obj.id).emit('cskh-is-end-typing',data);
            }
        });
    });
});

//Lấy tin nhắn của 
function getMessageOfCustomSend(custom, cskh , appid){
    return logMessageModel.find({$or:[ {'Receive':custom , 'AppId':appid,'SendBy':cskh}, {'Receive':cskh, 'AppId':appid,'SendBy':custom}]});
}

function convertDateNow(){
    var date = new Date();
    return date.getFullYear() +'-'+ (date.getMonth() +1)+'-'+date.getDate();
}

function convertDateNowToHour(){
    var date = new Date();
    return date.getHours() +':'+date.getMinutes();
}

function getAllMessageForAdminSocket(data){
    return logMessageModel.aggregate([
        { $match :{ Receive : data.Receive , AppId :data.AppId}},
        { $group : { _id : '$SendBy', data: { $push: "$$ROOT" } }},
        { $limit : 10 }
    ]);
}

function getMessageNotSeen(data){
    return logMessageModel.countDocuments({ AppId: data.AppId, Receive: data.Receive , Status: false});
}

function getIndexOfLastMessage(custom , cskh , appid){
    var room = custom+','+cskh;
    indexOfMessageModel.findOne({Room : room,AppId : appid})
}

//cập nhật lại trạng thái tin nhắn của khách hàng khi được cskh xem
function updatedSeenMessage(sendBy , appid , receive ,socket){
    logMessageModel.find({AppId : appid , SendBy:sendBy , Status: false}).then(function(messages){
        messages.forEach(function(obj){
            obj.Status = true;
            obj.save(function(err){
                if(!err){
                    var obj = {
                        AppId : appid,
                        Receive :receive
                    }
                    getMessageNotSeen(obj).then(function(count){
                        socket.emit('count-message-not-seen', count);
                    })
                    return true;
                }
                else{
                    console.log(err);
                    return false;
                }
            });
        });
    });
}

http.listen(3000, function(){
 // console.log('listening on *:3000');
});