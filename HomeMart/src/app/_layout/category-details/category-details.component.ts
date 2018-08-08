import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CommonServiceService } from '../../service/common-service.service';
import {PageEvent} from '@angular/material';
import {VatTu,VatTuDTO} from '../home/vattumodel';
@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styles: []
})
export class CategoryDetailsComponent implements OnInit {
  maloaivattu: string='';
  pageEvent: PageEvent;
  datasource: null;
  pageIndex:number;
  pageSize:number;
  length:number;
  result : VatTuDTO = null;
  lstVatTu : Array<VatTu>;
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private commonService : CommonServiceService
  ) { }

  ngOnInit() {
    this.maloaivattu= this.route.snapshot.paramMap.get('maloaivattu');
    this.filterData(null,this.maloaivattu);
  }

  filterData(event?:PageEvent,manhom?:string){
    this.commonService.getListMerchanediseByCategory(event,manhom).subscribe(arr=>{
      this.result = arr;
      console.log(this.result);
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
  })
  }

  public getServerData(event?:PageEvent){
    this.filterData(event,this.maloaivattu);
  }
}
