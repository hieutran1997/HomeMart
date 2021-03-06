import { Component, OnInit, ViewEncapsulation,Injectable  } from '@angular/core';
import {VatTu,VatTuDTO} from '../home/vattumodel';
import {PageEvent} from '@angular/material';
import { CookieService } from 'ngx-cookie-service';
import {CartModel,VatTuCart} from '../../model/cartModel';
import {ViewCartService} from '../view-cart.service';
import {CommonServiceService} from '../../service/common-service.service';
import { NhomVatTu } from '../../model/nhomVatTu';
import { Router } from '@angular/router';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-content-home',
  templateUrl: './content-home.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./content-home.component.css'],
  providers: [NgbRatingConfig] 
})
export class ContentHomeComponent implements OnInit {
  lstMerchansediseOld : Array<string>;
  maloaivattu : string = '';
  result : VatTuDTO = null;
  lstVatTu : Array<VatTu>;
  lstNhomVatTu : Array<NhomVatTu>;
  pageEvent: PageEvent;
  datasource: null;
  pageIndex:number;
  pageSize:number;
  length:number;
  cookieValue = 'UNKNOWN';
  vattuSelected : CartModel = null;
  sortOrders: string[] = ["Theo tên", "Theo giá bán", "Theo độ ưa thích"];
  viewer : string = 'table';
  sortAsc: Boolean = true;
  isLoading : Boolean = false;
  orderBy : string = 'vt.TENVATTU';
  sortType : string = 'ASC';
  itemSelect : VatTu;
  constructor(
    private cookieService: CookieService ,
    private viewCartService: ViewCartService,
    private commonService :CommonServiceService,
    private router: Router,
    private config: NgbRatingConfig,
    private modalService : NgbModal,
  ) { 
    config.max = 5;
  }

  ngOnInit() {
    this.filterData(null,this.orderBy,this.sortType);
    if(this.cookieService.check('vattutronggiohang')){
      this.cookieValue = this.cookieService.get('vattutronggiohang');
      this.vattuSelected =JSON.parse(this.cookieValue);   
    }
    else{
      this.vattuSelected = new CartModel([],0,0);
    }
  }
  display(item:string){
    if(item.length >40){
      return item.substring(0,40)+' ...';
    }
    else{
      return item;
    }
  }

  filterData(event?:PageEvent,order?:string,sortType?:string){
    this.isLoading = true;
    this.commonService.getDataPaging(event,order,sortType).subscribe(arr=>{
        this.isLoading = false;
        this.result = arr;
        if(event){
          event.pageIndex = this.result.PageNumber-1;
          event.pageSize = this.result.PageSize;
          event.length = this.result.ItemTotal;
        }
        else{
          this.pageIndex = this.result.PageNumber-1;
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
    this.pageEvent = event;
    this.filterData(event,this.orderBy,this.sortType);
  }
  
  addToCart(item){
    let lstVatTuCart :Array<VatTuCart> = [];
    let vattu : VatTu = null;
    vattu = item;
    vattu.SoLuong = 1;
    let vattuCart = new VatTuCart(vattu.MaVatTu,vattu.SoLuong);
    lstVatTuCart.push(vattuCart);
    if(this.vattuSelected){
      var j = 0;//Kiểm tra trùng
      if(this.vattuSelected.arrVatTuSelected){
        for(var i = 0 ; i < this.vattuSelected.arrVatTuSelected.length ; i++){
          if(this.vattuSelected.arrVatTuSelected[i].MaVatTu === vattu.MaVatTu){
            this.vattuSelected.arrVatTuSelected[i].SoLuong = this.vattuSelected.arrVatTuSelected[i].SoLuong + vattu.SoLuong;
            this.vattuSelected.tongSoLuong += 1;
            this.vattuSelected.tongTien += vattu.DonGia*vattu.SoLuong;
            j++;
          }
        }
      }
      if(j == 0){//Không trùng thì thêm mới
        this.vattuSelected.arrVatTuSelected.push(vattuCart);
        this.vattuSelected.tongSoLuong += vattu.SoLuong;
        this.vattuSelected.tongTien +=vattu.DonGia*vattu.SoLuong;
      }
      this.cookieService.delete('vattutronggiohang');
      this.cookieService.set( 'vattutronggiohang', JSON.stringify(this.vattuSelected),10);
      this.viewCartService.changedCartView(this.vattuSelected);
    }
    else{
      this.vattuSelected = new CartModel(lstVatTuCart,vattu.SoLuong,vattu.DonGia*vattu.SoLuong);
      this.vattuSelected.tongSoLuong = vattu.SoLuong;
      this.cookieService.set( 'vattutronggiohang', JSON.stringify(this.vattuSelected),10);
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
        // this.lstVatTu.sort(this.compareValues('TenVatTu','desc'));
        this.orderBy = 'vt.TENVATTU';
        this.sortType = 'DESC';
      }
      else{
        this.sortAsc = true;
        // this.lstVatTu.sort(this.compareValues('TenVatTu','asc'));
        this.orderBy = 'vt.TENVATTU';
        this.sortType = 'ASC';
      }
    }if(order === "Theo giá bán"){
      if(this.sortAsc){
        this.sortAsc = false;
        // this.lstVatTu.sort(this.compareValues('DonGia','desc'));
        this.orderBy = 'vt.GIABANLEVAT';
        this.sortType = 'DESC';
      }
      else{
        this.sortAsc = true;
        // this.lstVatTu.sort(this.compareValues('DonGia','asc'));
        this.orderBy = 'vt.GIABANLEVAT';
        this.sortType = 'ASC';
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
    if(this.pageEvent){
      this.filterData(this.pageEvent,this.orderBy,this.sortType);
    }
    else{
      this.filterData(null,this.orderBy,this.sortType);
    }
  }
  //đóng sắp xếp

  redirectDetail(item){
    this.router.navigateByUrl('/chi-tiet-hang-hoa/'+item.MaVatTu);
  }

    
  open(modal,item){
    this.itemSelect = item;
    this.modalService.open(modal,{ centered: true,size: 'sm'});
  }

  goToCart(){
    this.router.navigateByUrl('/chi-tiet-gio-hang');
  }
}
