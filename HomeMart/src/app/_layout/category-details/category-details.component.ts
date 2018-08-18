import { Component, OnInit ,OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CommonServiceService } from '../../service/common-service.service';
import {PageEvent} from '@angular/material';
import {VatTu,VatTuDTO} from '../home/vattumodel';
import {Router,NavigationEnd} from '@angular/router';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';
import {CartModel,VatTuCart} from '../../model/cartModel';
import { CookieService } from 'ngx-cookie-service';
import {ViewCartService} from '../view-cart.service';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.css'],
  providers: [NgbRatingConfig] 
})
export class CategoryDetailsComponent implements OnInit,OnDestroy {
  maloaivattu: string='';
  pageEvent: PageEvent = new PageEvent();
  datasource: null;
  pageIndex:number;
  pageSize:number;
  length:number;
  result : VatTuDTO = null;
  sortOrders: string[] = ["Theo tên", "Theo giá bán", "Theo độ ưa thích"];
  viewer : string = 'table';
  sortAsc: Boolean = true;
  lstVatTu : Array<VatTu>;
  navigationSubscription;
  isLoading : Boolean = false;
  vattuSelected : CartModel = null;
  cookieValue = 'UNKNOWN';
  categoryName = '';
  orderBy : string = 'vt.TENVATTU';
  sortType : string = 'ASC';
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private commonService : CommonServiceService,
    private router: Router,
    config: NgbRatingConfig,
    private cookieService: CookieService ,
    private viewCartService: ViewCartService,
  ) {
    config.max = 5;
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd ) {
        let url:string = e.urlAfterRedirects; 
        let manhomhang = url.split('/');
        this.filterData(null,manhomhang[manhomhang.length-1]);
      }
    });
   }

  ngOnInit() {
    this.maloaivattu= this.route.snapshot.paramMap.get('maloaivattu');
    this.filterData(null,this.maloaivattu);
    if(this.cookieService.check('vattutronggiohang')){
      this.cookieValue = this.cookieService.get('vattutronggiohang');
      this.vattuSelected =JSON.parse(this.cookieValue);   
    }
    this.viewCartService.category.subscribe(data=>{
      this.categoryName = data;
    });
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {  
       this.navigationSubscription.unsubscribe();
    }
  }

  filterData(event?:PageEvent,manhom?:string,order?:string,sortType?:string){
    this.isLoading = true;
    this.commonService.getListMerchanediseByCategory(event,manhom,order,sortType).subscribe(arr=>{
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
  })}
    
  display(item:string){
    if(item.length >50){
      return item.substring(0,50)+' ...';
    }
    else{
      return item;
    }
  }

  public getServerData(event?:PageEvent,order?:string,sortType?:string){
    this.pageEvent = event;
    this.filterData(event,this.maloaivattu,order,sortType);
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
            this.vattuSelected.tongSoLuong += vattu.SoLuong;
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
      this.filterData(this.pageEvent,this.maloaivattu,this.orderBy,this.sortType);
    }
    else{
      this.filterData(null,this.maloaivattu,this.orderBy,this.sortType);
    }
  }
  //đóng sắp xếp
  redirectDetail(item){
    this.router.navigateByUrl('/chi-tiet-hang-hoa/'+item.MaVatTu);
  }
}
