import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
@Injectable({
  providedIn: 'root'
})
export class CheckOutService {
  private appId = "BTSOFT";
  constructor(
    private socket : Socket
  ) { }

  emitCheckout(){
    return this.socket.emit('emit-check-out',this.appId);
  }
}
