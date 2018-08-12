import { Injectable } from '@angular/core';
import { VatTuDTO} from '../_layout/home/vattumodel';
import {HttpClient} from '@angular/common/http';
import {PageEvent} from '@angular/material';
import { khachHangModel } from '../model/khachHangModel';
import { loginModel } from '../model/loginModel';
import { post } from '../../../node_modules/@types/selenium-webdriver/http';
@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {

  madonvi:string = 'DV1-CH1';
  host:string = 'http://btsoftvn.com:50595/';
  makho :string= 'DV1-CH1-KBL';

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
    return this._http.get<VatTuDetail>(this.host+'api/home/GetDetailMerchanedise?mavattu='+mavattu+'&madonvi='+this.madonvi+'');
  }
  getAllMerchanediseType<LoaiVatTu>(){
    return this._http.get<LoaiVatTu>(this.host+'api/home/GetListMerchanediseType?madonvi='+this.madonvi);
  }
  getAllGroupMerchanedise<NhomVatTu>(){
    return this._http.get<NhomVatTu>(this.host + 'api/home/GetAllGroupMerchanedise?unitcode='+this.madonvi);
  }
  getMerchanediseByCode<viewDetailCart>(mavattu:string){
    return this._http.get<viewDetailCart>(this.host +"api/home/GetMerchanediseByCode?mavattuselect="+mavattu+"&madonvi="+this.madonvi);
  }
  getListMerchanediseKhuyenMai<VatTuDTO>(event? :PageEvent){
    if(event){
      return this._http.get<VatTuDTO>(this.host+'api/home/GetListMerchanediseKhuyenMai?pagesize='+event.pageSize+'&pagenumber='+event.pageIndex+'&makho='+this.makho+'&madonvi='+this.madonvi);
    }
    else{
      return this._http.get<VatTuDTO>(this.host+'api/home/GetListMerchanediseKhuyenMai?pagesize=6&pagenumber=1&makho='+this.makho+'&madonvi='+this.madonvi);
    }
  }
  register<objectResult>(obj?:khachHangModel){
    obj.MaDonVi = this.madonvi;
    return this._http.post<objectResult>(this.host +'api/home/RegisKhachHang',obj);
  }
  login<objectResult>(dataLogin?:loginModel){
    dataLogin.unitcode = this.madonvi;
    return this._http.get<objectResult>(this.host+'api/home/Login?username='+dataLogin.username+'&pass='+dataLogin.password+'&donvi='+this.madonvi);
  }
  getUserByPhone<khachHangModel>(phone?:string){
    return this._http.get<khachHangModel>(this.host +'api/home/GetUserByPhone?sodienthoai='+phone+'&unitcode2='+this.madonvi);
  }
}
