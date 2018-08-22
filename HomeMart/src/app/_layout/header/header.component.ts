import { Component, OnInit } from '@angular/core';
import { LoaiVatTu } from '../../model/LoaiVatTu';
import {CommonServiceService} from '../../service/common-service.service';
import { CookieService } from 'ngx-cookie-service';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';

const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
  'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
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
    let arrTemp = new Array({ Title : 'Hàng mới về' , url : '/'},{Title:'Khuyến mãi',url:'/chuong-trinh-khuyen-mai'});
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
  signOut(){
    this.cookieService.delete('taikhoanbanhang');
    this.checkUser = false;
  }
  public model: any;

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => {
        if(term.length < 2 ){
          [];
        }
        else{
          this.commonService.searchByCode(term).subscribe(result=>{
            console.log(result);
          });
          states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
        }
      })
    );
  SearchData(data){
    
  }
}
