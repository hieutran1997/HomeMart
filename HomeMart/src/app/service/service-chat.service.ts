import { Injectable , OnInit , Output ,EventEmitter} from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs/Observable';
import { logMessage } from '../model/logMessage';
import { Subject } from 'rxjs/Subject';

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
 
}
