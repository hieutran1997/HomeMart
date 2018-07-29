import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import{VatTu,VatTuDTO} from './vattumodel';
import {PageEvent} from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  result : VatTuDTO;
  lstVatTu : Array<VatTu>;
  pageEvent: PageEvent;
  datasource: null;
  pageIndex:number;
  pageSize:number;
  length:number;

  constructor( private _http: HttpClient) { }
  ngOnInit() {
    this.filterData(null);
  }
 
  filterData(event?:PageEvent){
    if(event){
      this._http.get<VatTuDTO>('http://localhost:50595/api/home/GetListMerchanedise?pagesize='+event.pageSize+'&pagenumber='+event.pageIndex)
        .subscribe(arr => {
          this.result = arr;
          console.log(this.result);
          event.pageIndex = this.result.PageNumber;
          event.pageSize = this.result.PageSize;
          event.length = this.result.ItemTotal;
          this.lstVatTu = this.result.Data;
        });
    }
    else{
      this._http.get<VatTuDTO>('http://localhost:50595/api/home/GetListMerchanedise?pagesize=6&pagenumber=1')
      .subscribe(arr => {
        this.result = arr;
        console.log(this.result);
        this.lstVatTu = this.result.Data;
        this.pageIndex = this.result.PageNumber;
        this.pageSize = this.result.PageSize;
        this.length = this.result.ItemTotal;
      });
    }
  }

  public getServerData(event?:PageEvent){
    console.log(event);
    this.filterData(event);
  }

  display(item:string){
    if(item.length >20){
      return item.substring(0,20)+' ...';
    }
    else{
      return item;
    }
  }
}
