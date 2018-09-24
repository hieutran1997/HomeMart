import { Injectable } from '@angular/core';
import { VatTuDTO} from '../_layout/home/vattumodel';
import {HttpClient,HttpParams } from '@angular/common/http';
import {PageEvent} from '@angular/material';
import {khachHangModel ,loginModel ,ObjectCartModel,City,Districts,AddressModel, NewsModel } from '../model';

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

  getDataPaging(event? :PageEvent,order?:string ,sorttype?:string){
    if(event){
      let pageIndex:number = event.pageIndex + 1;
      return this._http.get<VatTuDTO>(this.host+'api/home/GetListMerchanedise?pagesize='+event.pageSize+'&pagenumber='+pageIndex+'&order='+order+'&sorttype='+sorttype);
    }
    else{
      let defaultOrder = 'vt.TENVATTU';
      let defaultSortType = 'ASC';
      if(order&&sorttype){
        defaultOrder = order;
        defaultSortType = sorttype;
      }
      return this._http.get<VatTuDTO>(this.host+'api/home/GetListMerchanedise?pagesize=6&pagenumber=1&order='+defaultOrder+'&sorttype='+defaultSortType);
    }
  }
  getListMerchanediseByCategory(event? :PageEvent,manhom?:string,order?:string ,sorttype?:string){
    if(event){
      let pageIndex:number = event.pageIndex + 1;
      return this._http.get<VatTuDTO>(this.host+'api/home/GetListMerchanediseByCategory?pagesize='+event.pageSize+'&pagenumber='+pageIndex+'&merchanedisetype='+manhom+'&order='+order+'&sorttype='+sorttype);
    }
    else{
      let defaultOrder = 'vt.TENVATTU';
      let defaultSortType = 'ASC';
      if(order&&sorttype){
        defaultOrder = order;
        defaultSortType = sorttype;
      }
      return this._http.get<VatTuDTO>(this.host+'api/home/GetListMerchanediseByCategory?pagesize=6&pagenumber=1&merchanedisetype='+manhom+'&order='+defaultOrder+'&sorttype='+defaultSortType);
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
      return this._http.get<VatTuDTO>(this.host+'api/home/GetListMerchanediseKhuyenMai?pagesize=12&pagenumber=1&makho='+this.makho+'&madonvi='+this.madonvi);
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
  checkOut<objectResult>(data?:ObjectCartModel){
    return this._http.post<objectResult>(this.host+'api/home/CheckOut',data);
  }
  searchByCode(event? :PageEvent,code? :string){

    if(!event){
      let data ={
        pagenumber :1,
        pagesize : 12,
        keysearch: code,
        order: 'vt.TENVATTU',
        sorttype:'ASC',
      }
      return this._http.post<VatTuDTO>(this.host+'api/home/SearchByCode',data);
    }
    else{
      let data ={
        pagenumber : event.pageIndex +1,
        pagesize : event.pageSize,
        keysearch: code,
        order: 'vt.TENVATTU',
        sorttype:'ASC',
      }
      return this._http.post<VatTuDTO>(this.host+'api/home/SearchByCode',data);
    }
  }

  getMerchanediseRel(maloaivattu : string){
    let obj = {
      MaLoaiVatTu : maloaivattu,
      TenLoaiVatTu: '',
      UnitCode : this.madonvi
    }
    return this._http.post<any>(this.host+'api/home/GetMerchanediseRel',obj);
  }

  getAllOrder<donHangModel>(maKhachHang : string){
    return this._http.get<donHangModel>(this.host+'api/home/GetAllBill?maKhachHang='+maKhachHang);
  }

  deleteOrder<objectResult>(maDonHang:string){
    return this._http.get<objectResult>(this.host+'api/home/DeleteOrder?madonhang='+maDonHang);
  }

  getAddress(sodienthoai:string){
    return this._http.get<AddressModel>(this.host+'/api/home/GetAddress?sdt='+sodienthoai+'&madonvi='+this.madonvi);
  }

  getAllProvince(){
    return this._http.get<Array<City>[]>(this.host+'/api/home/GetAddressCity');
  }

  getDistrictsByCityId(cityid : string){
    return this._http.get<Array<Districts>>(this.host+'/api/home/GetDistrictsByCityId?cityid='+cityid);
  }
  getNews(type :string){
    return this._http.get<Array<NewsModel>>(this.host+'api/home/GetNews?unitcodefornews='+this.madonvi+'&type='+type);
  }
  getImageCover(){
    return this._http.get<Array<NewsModel>>(this.host+'api/home/GetImageCover?unitcodefornews='+this.madonvi);
  }
  getNewsDetailByTitle(title :string){
    return this._http.get<NewsModel>(this.host+'api/home/GetNewsDetailsByTitle?unitcodefornews='+this.madonvi+'&title='+title);
  }
}
