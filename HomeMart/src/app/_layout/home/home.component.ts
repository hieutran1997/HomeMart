import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import{VatTu,VatTuDTO} from './vattumodel';
import {PageEvent} from '@angular/material';
import { CookieService } from 'ngx-cookie-service';
import{CartModel} from '../../model/cartModel'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
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
  

  constructor( private _http: HttpClient, private cookieService: CookieService  ) { }
  ngOnInit() {
    this.filterData(null);
    this.cookieValue = this.cookieService.get('vattutronggiohang');
    if(this.cookieService.check('vattutronggiohang')){
      this.vattuSelected =JSON.parse(this.cookieValue);
      //this.cookieService.delete('vattutronggiohang');
      console.log(this.vattuSelected);
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
        });
    }
    else{
      this._http.get<VatTuDTO>('http://localhost:50595/api/home/GetListMerchanedise?pagesize=6&pagenumber=1')
      .subscribe(arr => {
        this.result = arr;
        console.log(this.result);
        this.lstVatTu = this.result.Data;
        this.pageIndex = this.result.PageNumber;
        this.pageSize = this.result.PageSize;
        this.length = this.result.ItemTotal;
      });
    }
  }

  public getServerData(event?:PageEvent){
    console.log(event);
    this.filterData(event);
  }

  display(item:string){
    if(item.length >20){
      return item.substring(0,20)+' ...';
    }
    else{
      return item;
    }
  }

  addToCart(item){
    let lstVatTuCart :Array<VatTu> = [];
    let vattu : VatTu;
    vattu.SoLuong = 1;
    vattu = item;
    lstVatTuCart.push(vattu);
    if(this.vattuSelected){
      this.vattuSelected.arrVatTuSelected.push(vattu);
      this.vattuSelected.tongTien += vattu.SoLuong*vattu.DonGia;
      this.cookieService.delete('vattutronggiohang');
      this.cookieService.set( 'vattutronggiohang', JSON.stringify(this.vattuSelected) );
    }
    else{
      this.vattuSelected = new CartModel(lstVatTuCart,vattu.SoLuong,vattu.DonGia*vattu.SoLuong);
      this.cookieService.set( 'vattutronggiohang', JSON.stringify(this.vattuSelected) );
    }
  }
}
