import { Component, OnInit } from '@angular/core';
import { LoaiVatTu } from '../../model/LoaiVatTu';
import {CommonServiceService} from '../../service/common-service.service';
import { CookieService } from 'ngx-cookie-service';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import { ObjectSearchDTO } from '../../model/objectSearchDTO';
import { SearchService } from  '../../service/search.service';
import {Router} from '@angular/router';

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
  constructor(
    private commonService : CommonServiceService,
    private cookieService:CookieService,
    private searchService : SearchService,
    private router: Router,
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
          this.lstLoaiVatTu.forEach(function(obj){
            arrTemp.push({
              Title : obj.TenLoaiVatTu,
              url: '/loai-hang/'+obj.MaLoaiVatTu
            });
          });

          arrTemp.push({
            Title : 'Giới thiệu',
            url: '/gioi-thieu'
          });
          this.listMenu = arrTemp;
        }
      }
    );
  }
  redirectFB(){
    let url="https://www.facebook.com/vnxkbanbuonbanle123/";
    window.open(url, '_blank');
  }
  signOut(){
    this.cookieService.delete('taikhoanbanhang');
    this.checkUser = false;
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
    // this.commonService.searchByCode<Array<ObjectSearchDTO>>(data).subscribe(result=>{
    //   this.lstSearch = result;
    //   this.searchService.searchByCode(this.lstSearch);
    // });
  }
}
