import { Component, OnInit } from '@angular/core';
import { LoaiVatTu ,NhomVatTu , sideBarShow} from '../../model';
import {CommonServiceService} from '../../service/common-service.service';
import { CookieService } from 'ngx-cookie-service';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import { ObjectSearchDTO } from '../../model/objectSearchDTO';
import { SearchService } from  '../../service/search.service';
import {Router} from '@angular/router';
import { LoginsuccesService} from '../../service/loginsucces.service';

const states = [];

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  lstSearch : Array<ObjectSearchDTO>;
  lstMerchansediseOld : Array<string>;
  lstLoaiVatTu : Array<LoaiVatTu>;
  checkUser : boolean = false;
  listMenu = new Array();
  lstNhomVatTu: Array<NhomVatTu>;
  constructor(
    private commonService : CommonServiceService,
    private cookieService:CookieService,
    private searchService : SearchService,
    private router: Router,
    private loginSuccessService : LoginsuccesService,
  ) { }

  ngOnInit() {
    let arrTemp = new Array();
    if(this.cookieService.check('taikhoanbanhang')){
      this.checkUser = true;
    }
    else{
      this.checkUser = false;
    }
    if(this.cookieService.check('lstMerchansediseOld')){
      this.lstMerchansediseOld = this.cookieService.get('lstMerchansediseOld').split(',');
      this.lstMerchansediseOld.forEach(function(obj){
        states.push(obj);
      });
    }
    this.commonService.getAllMerchanediseType<Array<LoaiVatTu>>().subscribe(
      data=>{
        this.lstLoaiVatTu = data;
        if(this.lstLoaiVatTu){
          this.getGroupMerchandise();
        }

      }
    );
    this.loginSuccessService.loginSucces.subscribe(data=>{
        this.checkUser = data;
      });
  }
  redirectFB(){
    let url="https://www.facebook.com/vnxkbanbuonbanle123/";
    window.open(url, '_blank');
  }

  redirectInfoPage(){
    let url="/thong-tin-ca-nhan";
    this.router.navigateByUrl(url);
  }

  signOut(){
    this.cookieService.delete('taikhoanbanhang');
    this.checkUser = false;
    this.loginSuccessService.logout();
  }
  public model: any;

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 1 ? []
        : states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );
  searchData(data){
    this.router.navigateByUrl('/tim-kiem/'+data);
  }

  getGroupMerchandise(){
    let arrTemp = new Array();
    arrTemp.push({
      title : 'Trang chủ',
      url: '/',
      children : []
    });
    this.commonService
      .getAllGroupMerchanedise<Array<NhomVatTu>>()
      .subscribe(res => {
        this.lstNhomVatTu = res;
        for (let i = 0; i < this.lstLoaiVatTu.length; i++) {
          let temp = new sideBarShow();
          temp.MaLoaiVatTu = this.lstLoaiVatTu[i].MaLoaiVatTu;
          temp.TenLoaiVatTu = this.lstLoaiVatTu[i].TenLoaiVatTu;
          let obj = {
            title : this.lstLoaiVatTu[i].TenLoaiVatTu,
            url: '/loai-hang/'+this.lstLoaiVatTu[i].MaLoaiVatTu,
            children : []
          }
          if (this.lstNhomVatTu) {
            for (let j = 0; j < this.lstNhomVatTu.length; j++) {
              if (temp.MaLoaiVatTu === this.lstNhomVatTu[j].MALOAIVATTU) {
                obj.children.push({
                  title : this.lstNhomVatTu[j].TENNHOMVATTU,
                  url: '/loai-hang/'+this.lstNhomVatTu[j].MANHOMVATTU,
                });
              }
            }
            arrTemp.push(obj);
          }
        }
        arrTemp.push({
          title : 'Giới thiệu',
          url: '/gioi-thieu',
          children : []
        },{
          title : 'Tin tức',
          url: '/tin-tuc',
          children : []
        }
        );
        this.listMenu = arrTemp;
      });
  }
}
