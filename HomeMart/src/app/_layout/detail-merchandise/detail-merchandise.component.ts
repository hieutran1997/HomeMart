import { Component, OnInit,enableProdMode ,ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {VatTu,VatTuDTO,VatTuDetail} from '../home/vattumodel';
import {CookieService} from 'ngx-cookie-service';
import {CartModel,VatTuCart} from '../../model/cartModel';
import { ViewCartService } from '../view-cart.service';
import { CommonServiceService } from '../../service/common-service.service';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import {Router,NavigationEnd} from '@angular/router';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgxAutoScroll} from "ngx-auto-scroll";

enableProdMode();

@Component({
  selector: 'app-detail-merchandise',
  templateUrl: './detail-merchandise.component.html',
  styleUrls: ['./detail-merchandise.css'],
  providers: [NgbRatingConfig] 
})
export class DetailMerchandiseComponent implements OnInit {
  @ViewChild(NgxAutoScroll) ngxAutoScroll: NgxAutoScroll;
  lstMerchansediseOld : Array<string>;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  mavattu: string='';
  navigationSubscription;
  vattu : VatTuDetail = new VatTuDetail();
  scoreFavorites : number[] = [1,2,3,4,5];
  soLuong:number=1;
  cookieValue = 'UNKNOWN';
  vattuSelected : CartModel = null;
  vattuRel = [];
  isLoading = false;
  itemSelect : VatTu;
  constructor( 
    private route: ActivatedRoute,
    private location: Location,
    private cookieService: CookieService ,
    private viewCartService: ViewCartService,
    private commonService :CommonServiceService,
    private router: Router,
    config: NgbRatingConfig,
    private modalService : NgbModal
  ) {
    config.max = 5;
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd ) {
        let url:string = e.urlAfterRedirects; 
        let mavt = url.split('/');
        window.scrollTo(0, 0);
        this.filterData(mavt[mavt.length-1]);
      }
    });
  }
  public forceScrollDown(): void {
    this.ngxAutoScroll.forceScrollDown();
  }

  ngOnInit() {
    this.mavattu= this.route.snapshot.paramMap.get('mavattu');
    this.filterData(this.mavattu);
    if(this.cookieService.check('vattutronggiohang')){
      this.cookieValue = this.cookieService.get('vattutronggiohang');
      this.vattuSelected =JSON.parse(this.cookieValue);
    }

    this.galleryOptions = [
      { "previewZoom": true, "previewRotate": true },
      { "breakpoint": 500, "width": "300px", "height": "300px", "thumbnailsColumns": 3 },
      { "breakpoint": 300, "width": "100%", "height": "200px", "thumbnailsColumns": 2 }
    ];

    this.galleryImages = [
    ];
  }
  display(item:string){
    if(item.length >50){
      return item.substring(0,50)+' ...';
    }
    else{
      return item;
    }
  }
  filterData(mavattu){
    this.isLoading = true;
   this.commonService.getDataDetail<VatTuDetail>(mavattu).subscribe(
      data =>{
        console.log(data);
        this.lstMerchansediseOld = [];
        if(data){
          this.vattu = data;
          this.vattu.selectFavorite = 0;
          this.commonService.getMerchanediseRel(this.vattu.MaNhomVatTu).subscribe(x=>{
            this.vattuRel = x;
            this.isLoading = false;
          });
          if(this.cookieService.check('lstMerchansediseOld')){
            this.lstMerchansediseOld = this.cookieService.get('lstMerchansediseOld').split(',');
            //this.cookieService.delete('lstMerchansediseOld');
          }
          if(this.lstMerchansediseOld.length>10){ //chỉ lưu 10 phần tử cũ
            let checkExist = this.checkExist(this.vattu.TenVatTu,this.lstMerchansediseOld);
            if(!checkExist){
              this.lstMerchansediseOld.splice(0,1);
              this.lstMerchansediseOld.push(this.vattu.TenVatTu);
              let temp = "";
              for(let i = 0 ;i < this.lstMerchansediseOld.length-1 ; i++){
                if(i ===0){
                  temp = this.lstMerchansediseOld[i];
                }
                else{
                  temp+=","+this.lstMerchansediseOld[i];
                }
              }
              this.cookieService.delete('lstMerchansediseOld');
              this.cookieService.set('lstMerchansediseOld',temp,10);
            }
          }
          else{
            let checkExist = this.checkExist(this.vattu.TenVatTu,this.lstMerchansediseOld);
            if(!checkExist){
              let temp = this.cookieService.get('lstMerchansediseOld');
              if(temp===""){
                temp = this.vattu.TenVatTu;
              }else{
                temp +=","+this.vattu.TenVatTu;
              }
              this.cookieService.delete('lstMerchansediseOld');
              this.cookieService.set('lstMerchansediseOld',temp,10);
            }
          }
          this.galleryImages= [];
          if(this.vattu.HinhAnhs){
            for(let i = 0 ; i < this.vattu.HinhAnhs.length ; i++){
              this.galleryImages.push({
                small: 'http://btsoftvn.com:8080'+this.vattu.HinhAnhs[i],
                medium: 'http://btsoftvn.com:8080'+this.vattu.HinhAnhs[i],
                big: 'http://btsoftvn.com:8080'+this.vattu.HinhAnhs[i]
              });
            }
          }
        }
      }
    )
  }

  checkExist(tenvattu:string , lstData:Array<string>):boolean{
    let index =lstData.indexOf(tenvattu);
    if(index >= 0)
      return true;
    else
      return false;
  }

  addToCart(item){
    let lstVatTuCart :Array<VatTuCart> = [];
    let vattu : VatTu = null;
    vattu = item;
    vattu.SoLuong = this.soLuong;
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
  open(modal,item){
    this.itemSelect = item;
    this.modalService.open(modal,{ centered: true,size: 'lg'});
  }

  goToCart(){
    this.router.navigateByUrl('/chi-tiet-gio-hang');
  }
}
