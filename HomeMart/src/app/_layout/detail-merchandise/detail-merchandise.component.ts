import { Component, OnInit,enableProdMode } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {VatTu,VatTuDTO,VatTuDetail} from '../home/vattumodel';
import {CookieService} from 'ngx-cookie-service';
import {CartModel} from '../../model/cartModel';
import {ViewCartService} from '../view-cart.service';
import {CommonServiceService} from '../../service/common-service.service';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';

enableProdMode();

@Component({
  selector: 'app-detail-merchandise',
  templateUrl: './detail-merchandise.component.html',
  styleUrls: ['./detail-merchandise.css'],
  providers: [NgbRatingConfig] 
})
export class DetailMerchandiseComponent implements OnInit {
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  mavattu: string='';
  vattu : VatTuDetail = new VatTuDetail();
  scoreFavorites : number[] = [1,2,3,4,5];
  soLuong:number=1;
  cookieValue = 'UNKNOWN';
  vattuSelected : CartModel = null;

  constructor( 
    private route: ActivatedRoute,
    private location: Location,
    private cookieService: CookieService ,
    private viewCartService: ViewCartService,
    private commonService :CommonServiceService,
    config: NgbRatingConfig
  ) {
    config.max = 5;
  }

  ngOnInit() {
    this.mavattu= this.route.snapshot.paramMap.get('mavattu');
    this.filterData(this.mavattu);
    if(this.cookieService.check('vattutronggiohang')){
      this.cookieValue = this.cookieService.get('vattutronggiohang');
      this.vattuSelected =JSON.parse(this.cookieValue);
      console.log(this.vattuSelected);
      //this.cookieService.delete('vattutronggiohang');
    }
     this.galleryOptions = [
        {
            width: '500px',
            height: '400px',
            thumbnailsColumns: 4,
            imageAnimation: NgxGalleryAnimation.Slide
        },
        // max-width 800
        {
            breakpoint: 800,
            width: '100%',
            height: '600px',
            imagePercent: 80,
            thumbnailsPercent: 20,
            thumbnailsMargin: 20,
            thumbnailMargin: 20
        },
        // max-width 400
        {
            breakpoint: 400,
            preview: false
        }
    ];

    this.galleryImages = [
    ];
  }
  filterData(mavattu){
   this.commonService.getDataDetail<VatTuDetail>(mavattu).subscribe(
      data =>{
        if(data){
          this.vattu = data;
          this.vattu.selectFavorite = 0;
          // this.galleryImages.push({
          //   small: this.vattu.Avartar,
          //   medium: this.vattu.Avartar,
          //   big: this.vattu.Avartar
          // });
          for(let i = 0 ; i < this.vattu.HinhAnhs.length ; i++){
            this.galleryImages.push({
              small: 'http://btsoftvn.com:8080'+this.vattu.HinhAnhs[i],
              medium: 'http://btsoftvn.com:8080'+this.vattu.HinhAnhs[i],
              big: 'http://btsoftvn.com:8080'+this.vattu.HinhAnhs[i]
            });
          }
        }
      }
    )
  }

  addToCart(item){
    let lstVatTuCart :Array<VatTu> = [];
    let vattu : VatTu =new VatTu();
    vattu = item;
    vattu.SoLuong = this.soLuong;
    lstVatTuCart.push(vattu);
    if(this.vattuSelected){
      var j = 0;
      if(this.vattuSelected.arrVatTuSelected){
        for(var i = 0 ; i < this.vattuSelected.arrVatTuSelected.length ; i++){
          if(this.vattuSelected.arrVatTuSelected[i].MaVatTu === vattu.MaVatTu){
            this.vattuSelected.arrVatTuSelected[i].SoLuong = this.vattuSelected.arrVatTuSelected[i].SoLuong + vattu.SoLuong;
            this.vattuSelected.tongSoLuong += vattu.SoLuong;
            j++;
          }
        }
      }
      if(j == 0){
        this.vattuSelected.arrVatTuSelected.push(vattu);
        this.vattuSelected.tongSoLuong += vattu.SoLuong;
      }
      var tongtien = 0;
      for(var i = 0 ; i < this.vattuSelected.arrVatTuSelected.length ; i++){
        tongtien = tongtien + this.vattuSelected.arrVatTuSelected[i].SoLuong *this.vattuSelected.arrVatTuSelected[i].DonGia;
      }
      this.vattuSelected.tongTien =tongtien;
      this.cookieService.delete('vattutronggiohang');
      this.cookieService.set( 'vattutronggiohang', JSON.stringify(this.vattuSelected) );
      this.viewCartService.changedCartView(this.vattuSelected);
    }
    else{
      this.vattuSelected = new CartModel(lstVatTuCart,vattu.SoLuong,vattu.DonGia*vattu.SoLuong);
      this.vattuSelected.tongSoLuong = vattu.SoLuong;
      this.cookieService.set( 'vattutronggiohang', JSON.stringify(this.vattuSelected) );
      this.viewCartService.changedCartView(this.vattuSelected);
    }
  }

  changeSoLuong(info){
    if(info === 'giam'){
      if(this.soLuong > 0){
        this.soLuong--;
      }
      else{
        return;
      }
    }
    else{
      this.soLuong++;
    }
  }
}
