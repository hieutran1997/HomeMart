import { Injectable, Output, EventEmitter } from '@angular/core';
import{CartModel} from '../model/cartModel';

@Injectable({
  providedIn: 'root'
})
export class ViewCartService {
  @Output() changeCart: EventEmitter<CartModel> = new EventEmitter();
  constructor() { }

  changedCartView(data :CartModel){
    this.changeCart.emit(data);
  }
}
