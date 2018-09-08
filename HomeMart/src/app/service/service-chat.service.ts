import { Injectable , OnInit , Output ,EventEmitter} from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class ServiceChatService implements OnInit {
  private appId = "BTSOFT";
  ngOnInit(): void {
    //this.initListenEvent();
  }

  constructor(private socket: Socket) { }

  connectedSocket(data){
    data.AppId =this.appId;
    this.socket.emit('custommer-join-web-size',data);
  }

  sendMessage(data : any){
    data.AppId =this.appId;
    data.Receive = 'cskh';
    //this.socket.emit('send-message-person',data);
    this.socket.emit('send-message-person',data);
  }

  getAllMessage(data:String){
    var obj = {
      Custommer : data,
      CSKH : 'cskh',
      AppId : this.appId
    }
    this.socket.emit('get-all-message-for-custommer',obj);
  }

  updateSeenMessage(data:String){
    var obj = {
      Username : data,
      AppId : this.appId
    }
    this.socket.emit('update-seen-message' , obj);
  }

  getMessageNotSeen(data:any){
    this.socket.emit('get-message-not-seen',data);
  }

  
  typingMessage(){
    var obj = {
      AppId :this.appId
    }
    this.socket.emit('typing-message-customer',obj);
  }


  resGetAllMessage(){
    return this.socket.fromEvent<any>('response-get-all-message-for-custommer');
  }

  resGetMessageNotSeen<Number>(){
    return this.socket.fromEvent<Number>('response-get-message-not-seen');
  }

  getMessageNew(){
    let observable = new Observable(observer => {
      this.socket.on('send-reply-message-custommer', (data) => {
        observer.next(data);    
      });
      return () => {
        this.socket.disconnect();
      };  
    })     
    return observable;
  }

  getStatus() {
    let observable = new Observable(observer => {
      this.socket.on('sended', (data) => {
        observer.next(data);    
      });
      return () => {
        this.socket.disconnect();
      };  
    })     
    return observable;
  }  
  checkCSKHOnline(){
    return this.socket.fromEvent<boolean>('check-cskh-online');
  }
  getTypingEvent(){
    return this.socket.fromEvent('cskh-is-typing');
  }
  getEndTyping(){
    return this.socket.fromEvent('cskh-is-end-typing');
  }
}
