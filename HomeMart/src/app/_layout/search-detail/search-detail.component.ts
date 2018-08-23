import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {VatTu,VatTuDTO} from '../home/vattumodel';
import { ObjectSearchDTO } from '../../model/objectSearchDTO';
import { CommonServiceService } from '../../service/common-service.service';
import {PageEvent} from '@angular/material';
import {Router,NavigationEnd} from '@angular/router';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';
import {CartModel,VatTuCart} from '../../model/cartModel';
import { CookieService } from 'ngx-cookie-service';
import {ViewCartService} from '../view-cart.service';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-search-detail',
  templateUrl: './search-detail.component.html',
  styleUrls: ['./search-detail.component.css']
})
export class SearchDetailComponent implements OnInit {
  tukhoa : string='';
  result : VatTuDTO = null;
  lstVatTu : Array<VatTu>;
  pageIndex:number;
  pageSize:number;
  length:number;
  viewer : string = 'table';
  pageEvent: PageEvent = new PageEvent();
  navigationSubscription;
  isLoading : Boolean = false;
  vattuSelected : CartModel = null;
  cookieValue = 'UNKNOWN';
  itemSelect : VatTu;
  constructor(
    private route: ActivatedRoute,
    private commonService :CommonServiceService,
    config: NgbRatingConfig,
    private cookieService: CookieService ,
    private viewCartService: ViewCartService,
    private modalService : NgbModal,
    private router: Router,
  ) {
    config.max = 5;
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd ) {
        let url:string = e.urlAfterRedirects; 
        let tukhoaNew = url.split('/');
        this.filterData(null,tukhoaNew[tukhoaNew.length-1]);
      }
    });
   }

  ngOnInit() {
    this.tukhoa= this.route.snapshot.paramMap.get('tukhoa');
    this.filterData(null,this.tukhoa);
  }

  filterData(event?:PageEvent,tukhoa?:string){
    this.isLoading = true;
    this.commonService.searchByCode(event,tukhoa).subscribe(arr=>{
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
    });
  }

  public getServerData(event?:PageEvent){
    this.pageEvent = event;
    this.filterData(event,this.tukhoa);
  }

  display(item:string){
    if(item.length >50){
      return item.substring(0,50)+' ...';
    }
    else{
      return item;
    }
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
  redirectDetail(item){
    this.router.navigateByUrl('/chi-tiet-hang-hoa/'+item.MaVatTu);
  }

    
  open(modal,item){
    this.itemSelect = item;
    this.modalService.open(modal,{ centered: true,size: 'lg'});
  }
  goToCart(){
    this.router.navigateByUrl('/chi-tiet-gio-hang');
  }
}
