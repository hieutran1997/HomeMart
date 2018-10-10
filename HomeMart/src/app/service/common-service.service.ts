import { Injectable } from "@angular/core";
import { VatTuDTO } from "../_layout/home/vattumodel";
import { HttpClient } from "@angular/common/http";
import { PageEvent } from "@angular/material";
import {
  khachHangModel,
  loginModel,
  ObjectCartModel,
  City,
  Districts,
  AddressModel,
  NewsModel,
  NewsPaging
} from "../model";

@Injectable({
  providedIn: "root"
})
export class CommonServiceService {
  madonvi: string = "DV1-CH1";
  host: string = "http://btsoftvn.com:50595/";
  //host: string = "http://localhost:50595/";
  makho: string = "DV1-CH1-KBL";

  constructor(private _http: HttpClient) {}

  getDataPaging(event?: PageEvent, order?: string, sorttype?: string) {
    if (event) {
      let pageIndex: number = event.pageIndex + 1;
      return this._http.get<VatTuDTO>(
        this.host +
          "api/home/GetListMerchanedise?pagesize=" +
          event.pageSize +
          "&pagenumber=" +
          pageIndex +
          "&order=" +
          order +
          "&sorttype=" +
          sorttype
      );
    } else {
      let defaultOrder = "vt.TENVATTU";
      let defaultSortType = "ASC";
      if (order && sorttype) {
        defaultOrder = order;
        defaultSortType = sorttype;
      }
      return this._http.get<VatTuDTO>(
        this.host +
          "api/home/GetListMerchanedise?pagesize=6&pagenumber=1&order=" +
          defaultOrder +
          "&sorttype=" +
          defaultSortType
      );
    }
  }
  getListMerchanediseByCategory(
    event?: PageEvent,
    manhom?: string,
    order?: string,
    sorttype?: string
  ) {
    if (event) {
      let pageIndex: number = event.pageIndex + 1;
      return this._http.get<VatTuDTO>(
        this.host +
          "api/home/GetListMerchanediseByCategory?pagesize=" +
          event.pageSize +
          "&pagenumber=" +
          pageIndex +
          "&merchanedisetype=" +
          manhom +
          "&order=" +
          order +
          "&sorttype=" +
          sorttype
      );
    } else {
      let defaultOrder = "vt.TENVATTU";
      let defaultSortType = "ASC";
      if (order && sorttype) {
        defaultOrder = order;
        defaultSortType = sorttype;
      }
      return this._http.get<VatTuDTO>(
        this.host +
          "api/home/GetListMerchanediseByCategory?pagesize=6&pagenumber=1&merchanedisetype=" +
          manhom +
          "&order=" +
          defaultOrder +
          "&sorttype=" +
          defaultSortType
      );
    }
  }
  getDataDetail<VatTuDetail>(mavattu: string) {
    return this._http.get<VatTuDetail>(
      this.host +
        "api/home/GetDetailMerchanedise?mavattu=" +
        mavattu +
        "&madonvi=" +
        this.madonvi +
        ""
    );
  }
  getAllMerchanediseType<LoaiVatTu>() {
    return this._http.get<LoaiVatTu>(
      this.host + "api/home/GetListMerchanediseType?madonvi=" + this.madonvi
    );
  }
  getAllGroupMerchanedise<NhomVatTu>() {
    return this._http.get<NhomVatTu>(
      this.host + "api/home/GetAllGroupMerchanedise?unitcode=" + this.madonvi
    );
  }
  getMerchanediseByCode<viewDetailCart>(mavattu: string) {
    return this._http.get<viewDetailCart>(
      this.host +
        "api/home/GetMerchanediseByCode?mavattuselect=" +
        mavattu +
        "&madonvi=" +
        this.madonvi
    );
  }
  getListMerchanediseKhuyenMai<VatTuDTO>(event?: PageEvent) {
    if (event) {
      return this._http.get<VatTuDTO>(
        this.host +
          "api/home/GetListMerchanediseKhuyenMai?pagesize=" +
          event.pageSize +
          "&pagenumber=" +
          event.pageIndex +
          "&makho=" +
          this.makho +
          "&madonvi=" +
          this.madonvi
      );
    } else {
      return this._http.get<VatTuDTO>(
        this.host +
          "api/home/GetListMerchanediseKhuyenMai?pagesize=12&pagenumber=1&makho=" +
          this.makho +
          "&madonvi=" +
          this.madonvi
      );
    }
  }
  register<objectResult>(obj?: khachHangModel) {
    obj.MaDonVi = this.madonvi;
    return this._http.post<objectResult>(
      this.host + "api/home/RegisKhachHang",
      obj
    );
  }
  login<objectResult>(dataLogin?: loginModel) {
    dataLogin.unitcode = this.madonvi;
    return this._http.get<objectResult>(
      this.host +
        "api/home/Login?username=" +
        dataLogin.username +
        "&pass=" +
        dataLogin.password +
        "&donvi=" +
        this.madonvi
    );
  }
  getUserByPhone<khachHangModel>(phone?: string) {
    return this._http.get<khachHangModel>(
      this.host +
        "api/home/GetUserByPhone?sodienthoai=" +
        phone +
        "&unitcode2=" +
        this.madonvi
    );
  }
  checkOut<objectResult>(data?: ObjectCartModel) {
    return this._http.post<objectResult>(this.host + "api/home/CheckOut", data);
  }
  searchByCode(event?: PageEvent, code?: string) {
    if (!event) {
      let data = {
        pagenumber: 1,
        pagesize: 12,
        keysearch: code,
        order: "vt.TENVATTU",
        sorttype: "ASC"
      };
      return this._http.post<VatTuDTO>(
        this.host + "api/home/SearchByCode",
        data
      );
    } else {
      let data = {
        pagenumber: event.pageIndex + 1,
        pagesize: event.pageSize,
        keysearch: code,
        order: "vt.TENVATTU",
        sorttype: "ASC"
      };
      return this._http.post<VatTuDTO>(
        this.host + "api/home/SearchByCode",
        data
      );
    }
  }

  getMerchanediseRel(maloaivattu: string) {
    let obj = {
      MaLoaiVatTu: maloaivattu,
      TenLoaiVatTu: "",
      UnitCode: this.madonvi
    };
    return this._http.post<any>(this.host + "api/home/GetMerchanediseRel", obj);
  }

  getAllOrder<donHangModel>(maKhachHang: string) {
    return this._http.get<donHangModel>(
      this.host + "api/home/GetAllBill?maKhachHang=" + maKhachHang
    );
  }

  deleteOrder<objectResult>(maDonHang: string) {
    return this._http.get<objectResult>(
      this.host + "api/home/DeleteOrder?madonhang=" + maDonHang
    );
  }

  getAddress(sodienthoai: string) {
    return this._http.get<AddressModel>(
      this.host +
        "/api/home/GetAddress?sdt=" +
        sodienthoai +
        "&madonvi=" +
        this.madonvi
    );
  }

  getAllProvince() {
    return this._http.get<Array<City>[]>(
      this.host + "/api/home/GetAddressCity"
    );
  }

  getDistrictsByCityId(cityid: string) {
    return this._http.get<Array<Districts>>(
      this.host + "/api/home/GetDistrictsByCityId?cityid=" + cityid
    );
  }
  getNews(type: string) {
    return this._http.get<Array<NewsModel>>(
      this.host +
        "api/home/GetNews?unitcodefornews=" +
        this.madonvi +
        "&type=" +
        type
    );
  }
  getImageCover() {
    return this._http.get<Array<NewsModel>>(
      this.host + "api/home/GetImageCover?unitcodefornews=" + this.madonvi
    );
  }
  getNewsDetailById(id: string) {
    return this._http.get<NewsModel>(
      this.host +
        "api/home/GetNewsDetailsById?unitcodefornewsdetails=" +
        this.madonvi +
        "&id=" +
        id
    );
  }
  getNewsPaging(event?: PageEvent) {
    if (event) {
      let pageIndex: number = event.pageIndex + 1;
      return this._http.get<NewsPaging>(
        this.host +
          "api/home/GetNewsPaging?pagesize=" +
          event.pageSize +
          "&pagenumber=" +
          pageIndex +
          "&unitcodefornews=" +
          this.madonvi +
          "&type=News"
      );
    } else {
      return this._http.get<NewsPaging>(
        this.host +
          "api/home/GetNewsPaging?pagesize=6&pagenumber=1" +
          "&unitcodefornews=" +
          this.madonvi +
          "&type=News"
      );
    }
  }
  getNewsPagingByTags(event?: PageEvent, tags?: string) {
    if (event) {
      let pageIndex: number = event.pageIndex + 1;
      return this._http.get<NewsPaging>(
        this.host +
          "api/home/GetNewsPagingByTags?pagesize=" +
          event.pageSize +
          "&pagenumber=" +
          pageIndex +
          "&unitcodefornews=" +
          this.madonvi +
          "&type=News&tags=" +
          tags
      );
    } else {
      return this._http.get<NewsPaging>(
        this.host +
          "api/home/GetNewsPagingByTags?pagesize=6&pagenumber=1" +
          "&unitcodefornews=" +
          this.madonvi +
          "&type=News&tags=" +
          tags
      );
    }
  }
  getNewsInvolve(id: string, tags: string) {
    return this._http.get<Array<NewsModel>>(
      this.host +
        "api/home/GetNewsInvolve?unitcodefornewsdetails=" +
        this.madonvi +
        "&id=" +
        id +
        "&tags=" +
        tags
    );
  }
  getTitleOfCategory(code:string){
    return this._http.get<string>(
      this.host +
        "api/home/GetTitleOfCategory?madonvi=" +
        this.madonvi +
        "&code=" +
        code
    );
  }
  cleanAccents = (str: string): string => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Combining Diacritical Marks
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // huyền, sắc, hỏi, ngã, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // mũ â (ê), mũ ă, mũ ơ (ư)
    return str;
  };
}
