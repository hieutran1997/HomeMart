import { Component, OnInit } from '@angular/core';
import {NgbPopoverConfig} from '@ng-bootstrap/ng-bootstrap';
import {ViewCartService} from '../view-cart.service';
import{CartModel} from '../../model/cartModel';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-ngbd-popover-config',
  templateUrl: './ngbd-popover-config.component.html',
  styles: [],
  providers: [NgbPopoverConfig] // add NgbPopoverConfig to the component providers
})
export class NgbdPopoverConfig{
  cookieValue = 'UNKNOWN';
  quantity : number;
  titleCart : String = '';
  contentCart : String = '';
  constructor(config: NgbPopoverConfig,private viewCartService: ViewCartService,private cookieService: CookieService ) {
    // customize default values of popovers used by this component tree
    config.placement = 'bottom';
    config.triggers = 'hover';
  }
  vattuSelected : CartModel = null;

  ngOnInit() {
    if(this.cookieService.check('vattutronggiohang')){
      this.cookieValue = this.cookieService.get('vattutronggiohang');
      this.vattuSelected =JSON.parse(this.cookieValue);
      //this.cookieService.delete('vattutronggiohang');
      this.quantity = this.vattuSelected.tongSoLuong;
      this.titleCart = 'Có tất cả : '+ this.quantity +' mặt hàng';
      let content = '';
      this.vattuSelected.arrVatTuSelected.forEach(x => {
        content += ' ' +x.TenVatTu+' : ' + x.SoLuong +'\n';
        if(content.length > 32){
          let temp = x.TenVatTu.substring(0,26)+'.. : '+x.SoLuong;
          this.contentCart +=temp;
        }
      });
      this.contentCart = content;
    }
    this.viewCartService.changeCart.subscribe(data => {
      let soluong = 0;
      this.quantity = data.tongSoLuong;
      this.vattuSelected = data;
      this.titleCart = 'Có tất cả : '+ this.quantity +' mặt hàng';
      let content = '';
      this.vattuSelected.arrVatTuSelected.forEach(x => {
        content += x.MaVatTu +x.TenVatTu +' : ' + x.SoLuong;
      });
      this.contentCart = content;
    });
  }
}
