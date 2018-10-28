import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CartModel,VatTuCart } from '../../model/cartModel';
import { VatTu,VatTuDTO } from '../home/vattumodel';
import { CommonServiceService } from '../../service/common-service.service';
import { viewDetailCart } from '../../model/viewDetailCart';
import { ViewCartService } from '../view-cart.service';
import { khachHangModel } from '../../model/khachHangModel';
import { loginModel } from '../../model/loginModel';
import { ObjectCartModel ,DetailsCart } from '../../model/ObjectCartDTO';
import { objectResult } from '../../model/objectResult';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { donHangModel } from '../../model/donHangModel';
import { ToastrService } from 'ngx-toastr';
import { CheckOutService } from '../../service/check-out.service';
import { AddressModel } from '../../model/AddressModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-view-cart-detail',
  templateUrl: './view-cart-detail.component.html',
  styleUrls: ['./view-cart-detail.component.css']
})
export class ViewCartDetailComponent implements OnInit {
  cookieValue = 'UNKNOWN';
  cookie ='UNKNOWN';
  vattuSelected : CartModel = null;
  lstVatTu : Array<VatTu>;
  lstViewVatTu = [];
  khachHang :khachHangModel = null;
  loginModel : loginModel =null;
  TenKH:string = '';
  DataDTO: ObjectCartModel;
  itemSelect = new viewDetailCart();
  lstOrder:Array<donHangModel>;
  maKH:string;
  orderSelected : donHangModel;
  isLoaddingOrder = false;
  address:AddressModel;
  formAddress: FormGroup;
  cities = [];
  districts = [];
  addresRecieve = '';

  constructor(
    private cookieService : CookieService,
    private commonService :CommonServiceService,
    private viewCartService: ViewCartService,
    private modalService : NgbModal,
    private router: Router,
    private toastr: ToastrService,
    private checkout : CheckOutService,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.formAddress = this._formBuilder.group({
      DiaChi: ['', Validators.required],
      TinhTP: ['',Validators.required],
      QuanHuyen: ['',Validators.required]
    });
    this.getProvince();
    if(this.cookieService.check('taikhoanbanhang')){
      this.cookie= this.cookieService.get('taikhoanbanhang')
      this.loginModel =JSON.parse(this.cookie);
      this.commonService.getUserByPhone<khachHangModel>(this.loginModel.username).subscribe(data=>{
        this.khachHang= data;
        this.TenKH = this.khachHang.TenKH;
        this.maKH = data.MaKH;
        this.isLoaddingOrder= true;
        this.getAddress();
      })
    }
    if(this.cookieService.check('vattutronggiohang')){
      this.cookieValue = this.cookieService.get('vattutronggiohang');
      this.vattuSelected =JSON.parse(this.cookieValue);
      for(let i = 0 ; i < this.vattuSelected.arrVatTuSelected.length ; i++){
        this.filterData(this.vattuSelected.arrVatTuSelected[i]);
      }
    }
  }
  filterData(vattu){
    this.commonService.getMerchanediseByCode<viewDetailCart>(vattu.MaVatTu).subscribe(data=>{
      let dataTemp = new viewDetailCart();
      dataTemp=data;
      dataTemp.MaVatTu = vattu.MaVatTu;
      dataTemp.SoLuong= vattu.SoLuong;
      if(this.lstViewVatTu){
        this.lstViewVatTu.push(dataTemp);
      }
      else{
        this.lstViewVatTu =[dataTemp];
      }
    })
  }

  getProvince(){
    this.commonService.getAllProvince().subscribe(data=>{
      if(data){
        this.cities = data;
        this.formAddress.value.QuanHuyen = null;
      }
    })
  }

  selectedCity(){
    this.commonService.getDistrictsByCityId(this.formAddress.value.TinhTP).subscribe(res=>{
      if(res){
        this.districts = res;
      }
    })
  }

  getAddress(){
    this.commonService.getAddress(this.khachHang.DienThoai).subscribe(res=>{
      if(res){
        this.address = res;
        this.addresRecieve = this.address.Address + ', quận(huyện) '+ this.address.Districts_Name + ' ,tỉnh(tp) '+this.address.City_Name;
      }
    })
  }

  open(modal,item){
    this.itemSelect = item;
    this.modalService.open(modal,{ centered: true , backdrop : 'static'});
  }

  openConfirm(modal){
    this.modalService.open(modal,{ centered: true , backdrop : 'static'});
  }

  SaveNewAddress(){
    if(this.formAddress.status !=='VALID'){
      this.toastr.warning('Địa chỉ không hợp lệ !');
      return;
    }
    else{
      this.toastr.success('Đổi địa chỉ thành công !');
      let cityid = this.formAddress.value.TinhTP;
      let objCity = this.cities.find(function(item){
        return item.City_Id == cityid;
      });
      let districtid = this.formAddress.value.QuanHuyen;
      let objDistrict = this.districts.find(function(item){
        return item.Districts_Id == districtid;
      });
      this.addresRecieve = this.formAddress.value.DiaChi + ', quận(huyện) '+ objDistrict.Districts_Name + ' ,tỉnh(tp) '+ objCity.City_Name;
    }
  }

  DeleteItem(){
    let item = this.itemSelect;
    let index = this.lstViewVatTu.indexOf(item);
    this.lstViewVatTu.splice(index,1);
    this.vattuSelected.arrVatTuSelected.splice(index,1);
    this.vattuSelected.tongSoLuong -= item.SoLuong;
    this.vattuSelected.tongTien -= item.GiaBanLeVat * item.SoLuong;
    this.cookieService.delete('vattutronggiohang');
    this.cookieService.set( 'vattutronggiohang', JSON.stringify(this.vattuSelected),10);
    this.viewCartService.changedCartView(this.vattuSelected);
  }

  ChangeAddress(modal){
    this.modalService.open(modal,{ backdrop : 'static'});
  }

  SubtractionItem(item){
    if(item.SoLuong > 0){
      item.SoLuong --;
    }else{
      return;
    }
    this.vattuSelected.tongSoLuong = this.vattuSelected.tongSoLuong - 1;
    this.vattuSelected.tongTien = this.vattuSelected.tongTien - item.GiaBanLeVat;
    this.vattuSelected.arrVatTuSelected.forEach(function(obj){
      if(obj.MaVatTu === item.MaVatTu){ //cập nhật lại số lượng trong cart
        obj.SoLuong = item.SoLuong;
      }
    });
    this.cookieService.delete('vattutronggiohang');
    this.cookieService.set( 'vattutronggiohang', JSON.stringify(this.vattuSelected),10);
    this.viewCartService.changedCartView(this.vattuSelected);
  }
  ChangedQuatity(item,soluong){
    if(soluong > item.TonKho){
      soluong = item.TonKho;
    }
    this.vattuSelected = new CartModel(null,0,0);
    let listTemp = [];
    let giaBan = 0;
    let soLuong = 0;
    this.lstViewVatTu.forEach(function(obj){
      let dataTemp = new VatTuCart(obj.MaVatTu,obj.SoLuong);
      listTemp.push(dataTemp);
      giaBan += obj.SoLuong*obj.GiaBanLeVat;
      soLuong += obj.SoLuong;
    });
    this.vattuSelected.arrVatTuSelected = listTemp;
    //cập nhật lại cart
    this.vattuSelected.tongSoLuong = soLuong;
    this.vattuSelected.tongTien = giaBan;
    this.cookieService.delete('vattutronggiohang');
    this.cookieService.set( 'vattutronggiohang', JSON.stringify(this.vattuSelected),10);
    this.viewCartService.changedCartView(this.vattuSelected);
  }
  PlusItem(item){
    if(item.SoLuong < item.TonKho){
      item.SoLuong ++;
    }else{
      return;
    }
    this.vattuSelected.tongSoLuong = this.vattuSelected.tongSoLuong + 1;
    this.vattuSelected.tongTien = this.vattuSelected.tongTien + item.GiaBanLeVat;
    this.vattuSelected.arrVatTuSelected.forEach(function(obj){
      if(obj.MaVatTu === item.MaVatTu){ //cập nhật lại số lượng trong cart
        obj.SoLuong = item.SoLuong;
      }
    });
    this.cookieService.delete('vattutronggiohang');
    this.cookieService.set( 'vattutronggiohang', JSON.stringify(this.vattuSelected),10);
    this.viewCartService.changedCartView(this.vattuSelected);
  }
  CheckOut(modalCheckLogin){
    if(this.cookieService.check('taikhoanbanhang')){
      let Detail = [];
      if(this.vattuSelected){
        if(this.vattuSelected.arrVatTuSelected.length === 0){
          this.toastr.warning('Quý khách vui lòng chọn hàng thanh toán !');
          return;
        }
        else{
          let tongtien = 0;
          let tongsoluong = 0 ;
          this.lstViewVatTu.forEach(function(obj){
            let objectDetail = new DetailsCart();
            objectDetail.DONGIA = obj.GiaBanLeVat;
            objectDetail.DONGIADEXUAT = obj.GiaBanLeVat;
            objectDetail.MAHANG = obj.MaVatTu;
            objectDetail.SOLUONG = obj.SoLuong;
            objectDetail.SOLUONGLE =  obj.SoLuong;
            objectDetail.TENHANG = obj.TenVatTu;
            tongtien +=  obj.SoLuong*obj.GiaBanLeVat;
            tongsoluong +=obj.SoLuong;
            Detail.push(objectDetail);
          });
          this.DataDTO = new ObjectCartModel(Detail);
          this.DataDTO.DIACHINN = this.addresRecieve;
          this.DataDTO.TENNN = this.khachHang.TenKH;
          this.DataDTO.UNITCODE = this.khachHang.MaDonVi;
          this.DataDTO.SDTNN = this.khachHang.DienThoai;
          this.DataDTO.MAKHACHHANG = this.khachHang.DienThoai;
          this.DataDTO.SOPHIEUCON = this.vattuSelected.arrVatTuSelected.length;
          this.DataDTO.SOLUONG = tongsoluong;
          this.DataDTO.THANHTIENSAUVAT = tongtien;
          if(this.DataDTO){
            this.commonService.checkOut<objectResult<string>>(this.DataDTO).subscribe(result=>{
                if(result.Result){
                  this.isLoaddingOrder = true;
                  this.toastr.success('Đặt hàng thành công ! Vui lòng chờ liên hệ từ chúng tôi');
                  this.checkout.emitCheckout();
                  this.commonService.getAllOrder<Array<donHangModel>>(this.maKH).subscribe(res=>{
                    this.isLoaddingOrder = false;
                    this.lstOrder = res;
                  });
                  this.cookieService.delete('vattutronggiohang');//refresh cart
                  this.vattuSelected = new CartModel([],0,0);
                  this.lstViewVatTu=[];
                  this.viewCartService.changedCartView(this.vattuSelected);
                }
            });
          }
        }
      }else{
        this.toastr.warning('Quý khách vui lòng chọn hàng thanh toán !');
        return;
      }
    }
    else{
      this.modalService.open(modalCheckLogin,{ centered: true , backdrop : 'static'});
    }
  }

  RedirectToLogin(){
    this.router.navigateByUrl('/dang-nhap');
  }
}
