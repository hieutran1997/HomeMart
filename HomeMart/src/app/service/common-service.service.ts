import { Injectable } from '@angular/core';
import { VatTu , VatTuDetail , VatTuDTO} from '../_layout/home/vattumodel';
import {HttpClient} from '@angular/common/http';
import {PageEvent} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {

  constructor(
    private _http: HttpClient, 
  ) { }

  getDataPaging(event? :PageEvent){
    if(event){
      return this._http.get<VatTuDTO>('http://localhost:50595/api/home/GetListMerchanedise?pagesize='+event.pageSize+'&pagenumber='+event.pageIndex);
    }
    else{
      return this._http.get<VatTuDTO>('http://localhost:50595/api/home/GetListMerchanedise?pagesize=6&pagenumber=1');
    }
  }
}
