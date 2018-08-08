import { Component, OnInit } from '@angular/core';
import { LoaiVatTu } from '../../model/LoaiVatTu';
import {CommonServiceService} from '../../service/common-service.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  lstLoaiVatTu : Array<LoaiVatTu>;

  listMenu = new Array();

  constructor(
    private commonService : CommonServiceService,
  ) { }

  ngOnInit() {
    let arrTemp = new Array({ Title : 'Trang chủ' , url : '/'});
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
