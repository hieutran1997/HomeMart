import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { logMessage } from '../model/logMessage';

@Injectable({
  providedIn: 'root'
})
export class ServiceChatService {
  
  private appId = "BTSOFT";

  private socket = io('http://localhost:3000');

  sendMessage(data : any){
    data.AppId =this.appId;
    data.Receive = 'cskh';
    this.socket.emit('send-message-person',data);
  }
}
