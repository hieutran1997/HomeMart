import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import{CartModel} from '../../model/cartModel';
import {VatTu,VatTuDTO} from '../home/vattumodel';
import {CommonServiceService} from '../../service/common-service.service';
import {viewDetailCart} from '../../model/viewDetailCart';
import {ViewCartService} from '../view-cart.service';
import { khachHangModel } from '../../model/khachHangModel';
import { loginModel } from '../../model/loginModel';

@Component({
  selector: 'app-view-cart-detail',
  templateUrl: './view-cart-detail.component.html',
  styles: []
})
export class ViewCartDetailComponent implements OnInit {
  cookieValue = 'UNKNOWN';
  cookie ='UNKNOWN';
  vattuSelected : CartModel = null;
  lstVatTu : Array<VatTu>;
  lstViewVatTu = [];
  khachHang :khachHangModel = null;
  loginModel : loginModel =null;
  TenKH:string = '';

  constructor(
    private cookieService : CookieService,
    private commonService :CommonServiceService,
    private viewCartService: ViewCartService,
  ) { }

  ngOnInit() {
    console.log(this.cookieService.getAll());
    if(this.cookieService.check('taikhoanbanhang')){
      this.cookie= this.cookieService.get('taikhoanbanhang')
      this.loginModel =JSON.parse(this.cookie);
      this.commonService.getUserByPhone<khachHangModel>(this.loginModel.username).subscribe(data=>{
        this.khachHang= data;
        this.TenKH = this.khachHang.TenKH;
      })
    }
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

  DeleteItem(item){
    let index = this.lstViewVatTu.indexOf(item);
    this.lstViewVatTu.splice(index,1);
    this.vattuSelected.arrVatTuSelected.splice(index,1);
    this.vattuSelected.tongSoLuong -= item.SoLuong;
    this.vattuSelected.tongTien -= item.GiaBanLeVat * item.SoLuong;
    this.cookieService.delete('vattutronggiohang');
    this.cookieService.set( 'vattutronggiohang', JSON.stringify(this.vattuSelected),10);
    this.viewCartService.changedCartView(this.vattuSelected);
  }

  SubtractionItem(item){
    item.SoLuong --;
    this.vattuSelected.tongSoLuong = this.vattuSelected.tongSoLuong - 1;
    this.vattuSelected.tongTien = this.vattuSelected.tongTien - item.GiaBanLeVat;
    this.vattuSelected.arrVatTuSelected.forEach(function(obj){
      if(obj.MaVatTu === item.MaVatTu){ //cập nhật lại số lượng trong cart
        obj.SoLuong = item.SoLuong;
      }
    });
    this.cookieService.delete('vattutronggiohang');
    this.cookieService.set( 'vattutronggiohang', JSON.stringify(this.vattuSelected),10);
    this.viewCartService.changedCartView(this.vattuSelected);
  }
  ChangedQuatity(item){
    let giaBanOld = 0;
    let soLuongOld = 0;
    this.lstViewVatTu.forEach(function(obj){
      if(obj.MaVatTu === item.MaVatTu){
        giaBanOld = obj.SoLuong*obj.GiaBanLeVat;
        soLuongOld = obj.SoLuong;
      }
    });
    //cập nhật lại cart
    this.vattuSelected.tongSoLuong = this.vattuSelected.tongSoLuong + item.SoLuong - soLuongOld;
    this.vattuSelected.tongTien = this.vattuSelected.tongTien + item.GiaBanLeVat*item.SoLuong - giaBanOld;
    this.vattuSelected.arrVatTuSelected.forEach(function(obj){
      if(obj.MaVatTu === item.MaVatTu){ //cập nhật lại số lượng trong cart
        obj.SoLuong = item.SoLuong;
      }
    });
    this.cookieService.delete('vattutronggiohang');
    this.cookieService.set( 'vattutronggiohang', JSON.stringify(this.vattuSelected),10);
    this.viewCartService.changedCartView(this.vattuSelected);
  }
  PlusItem(item){
    item.SoLuong ++;
    this.vattuSelected.tongSoLuong = this.vattuSelected.tongSoLuong + 1;
    this.vattuSelected.tongTien = this.vattuSelected.tongTien + item.GiaBanLeVat;
    this.vattuSelected.arrVatTuSelected.forEach(function(obj){
      if(obj.MaVatTu === item.MaVatTu){ //cập nhật lại số lượng trong cart
        obj.SoLuong = item.SoLuong;
      }
    });
    this.cookieService.delete('vattutronggiohang');
    this.cookieService.set( 'vattutronggiohang', JSON.stringify(this.vattuSelected),10);
    this.viewCartService.changedCartView(this.vattuSelected);
  }
}
