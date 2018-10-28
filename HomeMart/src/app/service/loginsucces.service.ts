import { Injectable ,Output,EventEmitter} from '@angular/core';
import { Socket } from 'ngx-socket-io';
@Injectable({
  providedIn: 'root'
})
export class LoginsuccesService {
  private appId = "BTSOFT";
  @Output() loginSucces: EventEmitter<Boolean> = new EventEmitter();
  @Output() logoutSucces : EventEmitter<Boolean> = new EventEmitter();
  constructor( private socket: Socket) { }

  loginSuccesed(){
    this.loginSucces.emit(true);
  }
  logout(){
    this.logoutSucces.emit(true);
  }

  registerSucces(){
    this.socket.emit("register-succes",this.appId);
  }
}
