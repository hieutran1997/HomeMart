import { Component, OnInit ,OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CommonServiceService } from '../../service/common-service.service';
import {PageEvent} from '@angular/material';
import {VatTu,VatTuDTO} from '../home/vattumodel';
import {Router,NavigationEnd} from '@angular/router';


@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.css']
})
export class CategoryDetailsComponent implements OnInit,OnDestroy {
  maloaivattu: string='';
  pageEvent: PageEvent;
  datasource: null;
  pageIndex:number;
  pageSize:number;
  length:number;
  result : VatTuDTO = null;
  sortOrders: string[] = ["Theo tên", "Theo giá bán", "Theo độ ưa thích"];
  scoreFavorites : number[] = [1,2,3,4,5];
  viewer : string = 'table';
  sortAsc: Boolean = true;
  lstVatTu : Array<VatTu>;
  navigationSubscription;
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private commonService : CommonServiceService,
    private router: Router,
  ) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd ) {
        let url:string = e.urlAfterRedirects; 
        let manhomhang = url.split('/');
        this.filterData(null,manhomhang[manhomhang.length-1]);
      }
    });
   }

  ngOnInit() {
    this.maloaivattu= this.route.snapshot.paramMap.get('maloaivattu');
    console.log(this.maloaivattu);
    this.filterData(null,this.maloaivattu);
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {  
       this.navigationSubscription.unsubscribe();
    }
  }

  filterData(event?:PageEvent,manhom?:string){
    this.commonService.getListMerchanediseByCategory(event,manhom).subscribe(arr=>{
      this.result = arr;
      if(event){
        event.pageIndex = this.result.PageNumber;
        event.pageSize = this.result.PageSize;
        event.length = this.result.ItemTotal;
      }
      else{
        this.pageIndex = this.result.PageNumber;
        this.pageSize = this.result.PageSize;
        this.length = this.result.ItemTotal;
      }
      this.lstVatTu = this.result.Data;
      this.lstVatTu.forEach(function(obj){
          obj.selectFavorite = 0;
      });
  })}
    
  display(item:string){
    if(item.length >15){
      return item.substring(0,15)+' ...';
    }
    else{
      return item;
    }
  }

  public getServerData(event?:PageEvent){
    this.filterData(event,this.maloaivattu);
  }

    //sắp xếp 
  compareValues(key, order='asc') {
    return function(a, b) {
      if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
          return 0; 
      }
  
      const varA = (typeof a[key] === 'string') ? 
        a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string') ? 
        b[key].toUpperCase() : b[key];
  
      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order == 'desc') ? (comparison * -1) : comparison
      );
    }
  }
  ChangeSortOrder(order){
    if(order ==="Theo tên"){
      if(this.sortAsc){
        this.sortAsc = false;
        this.lstVatTu.sort(this.compareValues('TenVatTu','desc'));
      }
      else{
        this.sortAsc = true;
        this.lstVatTu.sort(this.compareValues('TenVatTu','asc'));
      }
    }if(order === "Theo giá bán"){
      if(this.sortAsc){
        this.sortAsc = false;
        this.lstVatTu.sort(this.compareValues('DonGia','desc'));
      }
      else{
        this.sortAsc = true;
        this.lstVatTu.sort(this.compareValues('DonGia','asc'));
      }
    }if(order ==="Theo độ ưa thích"){
      if(this.sortAsc){
        this.sortAsc = false;
        this.lstVatTu.sort(this.compareValues('DonGia','desc'));
      }
      else{
        this.sortAsc = true;
        this.lstVatTu.sort(this.compareValues('DonGia','asc'));
      }
    }
  }
  //đóng sắp xếp
}
