import { Injectable ,Output,EventEmitter} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginsuccesService {
  @Output() loginSucces: EventEmitter<Boolean> = new EventEmitter();
  @Output() logoutSucces : EventEmitter<Boolean> = new EventEmitter();
  constructor() { }

  loginSuccesed(){
    this.loginSucces.emit(true);
  }
  logout(){
    this.logoutSucces.emit(true);
  }
}
