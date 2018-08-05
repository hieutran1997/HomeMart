import { Component, OnInit,enableProdMode } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {VatTu,VatTuDTO,VatTuDetail} from '../home/vattumodel';
import {CookieService} from 'ngx-cookie-service';
import {CartModel} from '../../model/cartModel';
import {ViewCartService} from '../view-cart.service';


enableProdMode();

@Component({
  selector: 'app-detail-merchandise',
  templateUrl: './detail-merchandise.component.html',
  styleUrls: ['./detail-merchandise.css']
})
export class DetailMerchandiseComponent implements OnInit {

  mavattu: string='';
  vattu : VatTuDetail = new VatTuDetail();
  scoreFavorites : number[] = [1,2,3,4,5];
  soLuong:number=1;
  constructor( 
    private route: ActivatedRoute,
    private location: Location,
    private _http: HttpClient, 
    private cookieService: CookieService ,
    private viewCartService: ViewCartService,
  ) {}

  ngOnInit() {
    this.mavattu= this.route.snapshot.paramMap.get('mavattu');
    this.filterData(this.mavattu);
    
  }
  filterData(mavattu){
    this._http.get<VatTuDetail>('http://localhost:50595/api/home/GetDetailMerchanedise?mavattu='+mavattu)
    .subscribe(
      data =>{
        if(data){
          this.vattu = data;
          this.vattu.selectFavorite = 0;
          console.log(this.vattu);
        }
      }
    )
  }
}
