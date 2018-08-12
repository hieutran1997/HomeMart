import { Component, OnInit } from '@angular/core';
import { LoaiVatTu } from '../../model/LoaiVatTu';
import {CommonServiceService} from '../../service/common-service.service';
import { CookieService } from 'ngx-cookie-service';
import { loginModel } from '../../model/loginModel';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  lstLoaiVatTu : Array<LoaiVatTu>;
  checkUser : boolean = false;
  listMenu = new Array();
  constructor(
    private commonService : CommonServiceService,
    private cookieService:CookieService,
  ) { }

  ngOnInit() {
    let arrTemp = new Array({ Title : 'Trang chủ' , url : '/'},{Title:'Khuyến mãi',url:'/chuong-trinh-khuyen-mai'});
    if(this.cookieService.check('taikhoanbanhang')){
      this.checkUser = true;
    }
    else{
      this.checkUser = false;
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
          this.listMenu = arrTemp;
        }
      }
    );
  }
}
