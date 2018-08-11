import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import{CartModel} from '../../model/cartModel';
import {VatTu,VatTuDTO} from '../home/vattumodel';
import {CommonServiceService} from '../../service/common-service.service';
import {viewDetailCart} from '../../model/viewDetailCart';
@Component({
  selector: 'app-view-cart-detail',
  templateUrl: './view-cart-detail.component.html',
  styles: []
})
export class ViewCartDetailComponent implements OnInit {
  cookieValue = 'UNKNOWN';
  vattuSelected : CartModel = null;
  lstVatTu : Array<VatTu>;
  lstViewVatTu = [];
  constructor(
    private cookieService : CookieService,
    private commonService :CommonServiceService,
  ) { }

  ngOnInit() {
    if(this.cookieService.check('vattutronggiohang')){
      this.cookieValue = this.cookieService.get('vattutronggiohang');
      this.vattuSelected =JSON.parse(this.cookieValue);
      for(let i = 0 ; i < this.vattuSelected.arrVatTuSelected.length ; i++){
        this.filterData(this.vattuSelected.arrVatTuSelected[i]);
      }
    }
  }
  filterData(vattu){
    this.commonService.getMerchanediseByCode<viewDetailCart>(vattu.MaVatTu).subscribe(data=>{
      let dataTemp = new viewDetailCart();
      dataTemp=data;
      dataTemp.MaVatTu = vattu.MaVatTu;
      dataTemp.SoLuong= vattu.SoLuong;
      if(this.lstViewVatTu){
        this.lstViewVatTu.push(dataTemp);
      }
      else{
        this.lstViewVatTu =[dataTemp];
      }
    })
  }
}
