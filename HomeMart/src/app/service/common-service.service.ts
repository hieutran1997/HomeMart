import { Injectable } from '@angular/core';
import { VatTu , VatTuDetail , VatTuDTO} from '../_layout/home/vattumodel';
import {LoaiVatTu} from '../model/LoaiVatTu';
import { NhomVatTu } from '../model/nhomVatTu'
import {HttpClient} from '@angular/common/http';
import {PageEvent} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {

  host:string = 'http://localhost:50595/';

  constructor(
    private _http: HttpClient, 
  ) { }

  getDataPaging(event? :PageEvent){
    if(event){
      return this._http.get<VatTuDTO>(this.host+'api/home/GetListMerchanedise?pagesize='+event.pageSize+'&pagenumber='+event.pageIndex);
    }
    else{
      return this._http.get<VatTuDTO>(this.host+'api/home/GetListMerchanedise?pagesize=6&pagenumber=1');
    }
  }

  getListMerchanediseByCategory(event? :PageEvent,manhom?:string){
    if(event){
      return this._http.get<VatTuDTO>(this.host+'api/home/GetListMerchanediseByCategory?pagesize='+event.pageSize+'&pagenumber='+event.pageIndex+'&merchanedisetype='+manhom);
    }
    else{
      return this._http.get<VatTuDTO>(this.host+'api/home/GetListMerchanediseByCategory?pagesize=6&pagenumber=1&merchanedisetype='+manhom);
    }
  }

  getDataDetail<VatTuDetail>(mavattu :string){
    return this._http.get<VatTuDetail>(this.host+'api/home/GetDetailMerchanedise?mavattu='+mavattu);
  }

  getAllMerchanediseType<LoaiVatTu>(){
    return this._http.get<LoaiVatTu>(this.host+'api/home/GetListMerchanediseType?madonvi=DV1-CH1');
  }

  getAllGroupMerchanedise<NhomVatTu>(){
    return this._http.get<NhomVatTu>(this.host + 'api/home/GetAllGroupMerchanedise?unitcode=DV1-CH1');
  }
}
