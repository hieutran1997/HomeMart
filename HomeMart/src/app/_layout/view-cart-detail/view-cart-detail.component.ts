import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import{CartModel} from '../../model/cartModel';
@Component({
  selector: 'app-view-cart-detail',
  templateUrl: './view-cart-detail.component.html',
  styles: []
})
export class ViewCartDetailComponent implements OnInit {
  cookieValue = 'UNKNOWN';
  vattuSelected : CartModel = null;
  constructor(private cookieService : CookieService) { }

  ngOnInit() {
    if(this.cookieService.check('vattutronggiohang')){
      this.cookieValue = this.cookieService.get('vattutronggiohang');
      this.vattuSelected =JSON.parse(this.cookieValue);
      console.log(this.vattuSelected);
    }
  }
}
