import { Component, OnInit,EventEmitter, Input, Output } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {VatTu,VatTuDTO} from './vattumodel';
import {PageEvent} from '@angular/material';
import { CookieService } from 'ngx-cookie-service';
import {CartModel} from '../../model/cartModel';
import {ViewCartService} from '../view-cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  result : VatTuDTO = null;
  lstVatTu : Array<VatTu>;
  pageEvent: PageEvent;
  datasource: null;
  pageIndex:number;
  pageSize:number;
  length:number;
  cookieValue = 'UNKNOWN';
  vattuSelected : CartModel = null;
  
  constructor( private _http: HttpClient, private cookieService: CookieService ,private viewCartService: ViewCartService) { }
  ngOnInit() {
    this.filterData(null);
    if(this.cookieService.check('vattutronggiohang')){
      this.cookieValue = this.cookieService.get('vattutronggiohang');
      this.vattuSelected =JSON.parse(this.cookieValue);
      //this.cookieService.delete('vattutronggiohang');
    }
  }

  filterData(event?:PageEvent){
    if(event){
      this._http.get<VatTuDTO>('http://localhost:50595/api/home/GetListMerchanedise?pagesize='+event.pageSize+'&pagenumber='+event.pageIndex)
        .subscribe(arr => {
          this.result = arr;
          event.pageIndex = this.result.PageNumber;
          event.pageSize = this.result.PageSize;
          event.length = this.result.ItemTotal;
          this.lstVatTu = this.result.Data;
          console.log(this.lstVatTu);
        });
    }
    else{
      this._http.get<VatTuDTO>('http://localhost:50595/api/home/GetListMerchanedise?pagesize=6&pagenumber=1')
      .subscribe(arr => {
        this.result = arr;
        this.lstVatTu = this.result.Data;
        this.pageIndex = this.result.PageNumber;
        this.pageSize = this.result.PageSize;
        this.length = this.result.ItemTotal;
        console.log(this.lstVatTu);
      });
    }
  }

  public getServerData(event?:PageEvent){
    console.log(event);
    this.filterData(event);
  }

  display(item:string){
    if(item.length >15){
      return item.substring(0,15)+' ...';
    }
    else{
      return item;
    }
  }

  addToCart(item){
    let lstVatTuCart :Array<VatTu> = [];
    let vattu : VatTu = null;
    vattu = item;
    vattu.SoLuong = 1;
    lstVatTuCart.push(vattu);
    if(this.vattuSelected){
      var j = 0;
      if(this.vattuSelected.arrVatTuSelected){
        for(var i = 0 ; i < this.vattuSelected.arrVatTuSelected.length ; i++){
          if(this.vattuSelected.arrVatTuSelected[i].MaVatTu === vattu.MaVatTu){
            this.vattuSelected.arrVatTuSelected[i].SoLuong = this.vattuSelected.arrVatTuSelected[i].SoLuong + vattu.SoLuong;
            this.vattuSelected.tongSoLuong += 1;
            j++;
          }
        }
      }
      if(j == 0){
        this.vattuSelected.arrVatTuSelected.push(vattu);
        this.vattuSelected.tongSoLuong += vattu.SoLuong;
      }
      var tongtien = 0;
      for(var i = 0 ; i < this.vattuSelected.arrVatTuSelected.length ; i++){
        tongtien = tongtien + this.vattuSelected.arrVatTuSelected[i].SoLuong *this.vattuSelected.arrVatTuSelected[i].DonGia;
      }
      this.vattuSelected.tongTien =tongtien;
      this.cookieService.delete('vattutronggiohang');
      this.cookieService.set( 'vattutronggiohang', JSON.stringify(this.vattuSelected) );
      this.viewCartService.changedCartView(this.vattuSelected);
    }
    else{
      this.vattuSelected = new CartModel(lstVatTuCart,vattu.SoLuong,vattu.DonGia*vattu.SoLuong);
      this.vattuSelected.tongSoLuong = vattu.SoLuong;
      this.cookieService.set( 'vattutronggiohang', JSON.stringify(this.vattuSelected) );
      this.viewCartService.changedCartView(this.vattuSelected);
    }
  }
}
