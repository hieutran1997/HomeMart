import { Component, OnInit,EventEmitter, Input, Output } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {VatTu,VatTuDTO} from './vattumodel';
import {PageEvent} from '@angular/material';
import { CookieService } from 'ngx-cookie-service';
import {CartModel} from '../../model/cartModel';
import {ViewCartService} from '../view-cart.service';
import {MatPaginatorIntl} from '@angular/material';
import {CommonServiceService} from '../../service/common-service.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent  implements OnInit {
  result : VatTuDTO = null;
  lstVatTu : Array<VatTu>;
  pageEvent: PageEvent;
  datasource: null;
  pageIndex:number;
  pageSize:number;
  length:number;
  cookieValue = 'UNKNOWN';
  vattuSelected : CartModel = null;
  sortOrders: string[] = ["Theo tên", "Theo giá bán", "Theo độ ưa thích"];
  scoreFavorites : number[] = [1,2,3,4,5];
  viewer : string = 'table';
  sortAsc: Boolean = true;
  constructor( 
    private _http: HttpClient, 
    private cookieService: CookieService ,
    private viewCartService: ViewCartService,
    private initPaging : MatPaginatorIntl,
    private commonService :CommonServiceService
  ) { }
  ngOnInit() {
    this.filterData(null);
    if(this.cookieService.check('vattutronggiohang')){
      this.cookieValue = this.cookieService.get('vattutronggiohang');
      this.vattuSelected =JSON.parse(this.cookieValue);
      //this.cookieService.delete('vattutronggiohang');
    }
  }

  filterData(event?:PageEvent){
    this.commonService.getDataPaging(event).subscribe(arr=>{
        this.result = arr;
        if(event){
          event.pageIndex = this.result.PageNumber;
          event.pageSize = this.result.PageSize;
          event.length = this.result.ItemTotal;
        }
        else{
          this.pageIndex = this.result.PageNumber;
          this.pageSize = this.result.PageSize;
          this.length = this.result.ItemTotal;
        }
        this.lstVatTu = this.result.Data;
        this.lstVatTu.forEach(function(obj){
            obj.selectFavorite = 0;
        });
    })
  }

  public getServerData(event?:PageEvent){
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

  //sắp xếp 
  compareValues(key, order='asc') {
    return function(a, b) {
      if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
          return 0; 
      }
  
      const varA = (typeof a[key] === 'string') ? 
        a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string') ? 
        b[key].toUpperCase() : b[key];
  
      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order == 'desc') ? (comparison * -1) : comparison
      );
    }
  }
  ChangeSortOrder(order){
    if(order ==="Theo tên"){
      if(this.sortAsc){
        this.sortAsc = false;
        this.lstVatTu.sort(this.compareValues('TenVatTu','desc'));
      }
      else{
        this.sortAsc = true;
        this.lstVatTu.sort(this.compareValues('TenVatTu','asc'));
      }
    }if(order === "Theo giá bán"){
      if(this.sortAsc){
        this.sortAsc = false;
        this.lstVatTu.sort(this.compareValues('DonGia','desc'));
      }
      else{
        this.sortAsc = true;
        this.lstVatTu.sort(this.compareValues('DonGia','asc'));
      }
    }if(order ==="Theo độ ưa thích"){
      if(this.sortAsc){
        this.sortAsc = false;
        this.lstVatTu.sort(this.compareValues('DonGia','desc'));
      }
      else{
        this.sortAsc = true;
        this.lstVatTu.sort(this.compareValues('DonGia','asc'));
      }
    }
  }
  //đóng sắp xếp
}
