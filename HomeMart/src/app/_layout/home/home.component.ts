import { Component, OnInit,EventEmitter, Input, Output } from '@angular/core';
import {VatTu,VatTuDTO} from './vattumodel';
import {PageEvent} from '@angular/material';
import { CookieService } from 'ngx-cookie-service';
import {CartModel} from '../../model/cartModel';
import {ViewCartService} from '../view-cart.service';
import {CommonServiceService} from '../../service/common-service.service';
import { LoaiVatTu } from '../../model/LoaiVatTu';
import { NhomVatTu } from '../../model/nhomVatTu';
import {sideBarShow} from '../../model/sideBarShowModel';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [],
})
export class HomeComponent  implements OnInit {
  maloaivattu: string='';
  result : VatTuDTO = null;
  lstVatTu : Array<VatTu>;
  lstLoaiVatTu : Array<LoaiVatTu>;
  lstNhomVatTu : Array<NhomVatTu>;
  lstSideBar : Array<sideBarShow> = [];
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
  isViewContent = false;
  constructor( 
    private cookieService: CookieService ,
    private commonService :CommonServiceService,
    private route: ActivatedRoute,
    private location: Location,
  ) { }
  ngOnInit() {
    this.maloaivattu= this.route.snapshot.paramMap.get('maloaivattu');
    if(this.maloaivattu){
      this.isViewContent = true;
    }
    else{
      this.isViewContent = false;
    }
    this.commonService.getAllMerchanediseType<Array<LoaiVatTu>>().subscribe(
      data=>{
        this.lstLoaiVatTu = data;
        this.getAllGroupMerchanedise();
      });
    if(this.cookieService.check('vattutronggiohang')){
      this.cookieValue = this.cookieService.get('vattutronggiohang');
      this.vattuSelected =JSON.parse(this.cookieValue);
      //this.cookieService.delete('vattutronggiohang');
    }
  }

  getAllGroupMerchanedise(){
    this.commonService.getAllGroupMerchanedise<Array<NhomVatTu>>().subscribe(
      res=>{
        this.lstNhomVatTu = res;
        for(let i = 0 ; i < this.lstLoaiVatTu.length ; i++){
          let temp= new sideBarShow() ;
          temp.MaLoaiVatTu = this.lstLoaiVatTu[i].MaLoaiVatTu;
          temp.TenLoaiVatTu = this.lstLoaiVatTu[i].TenLoaiVatTu;
          if(this.lstNhomVatTu){
            for(let j = 0 ; j < this.lstNhomVatTu.length ; j++){
              if(temp.MaLoaiVatTu === this.lstNhomVatTu[j].MALOAIVATTU){
                temp.ListNhomVatTu.push(this.lstNhomVatTu[j]);
              }
            }
          }
          this.lstSideBar.push(temp);
        }
      }
    );
  }
}
