import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../../service/common-service.service';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import {loginModel ,khachHangModel ,donHangModel ,objectResult} from '../../model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-info-custom',
  templateUrl: './info-custom.component.html',
  styles: []
})
export class InfoCustomComponent implements OnInit {
  cookieValue = 'UNKNOWN';
  cookie ='UNKNOWN';
  loginModel : loginModel =null;
  khachHang :khachHangModel = null;
  TenKH:string = '';
  lstOrder:Array<donHangModel>;
  maKH:string;
  orderSelected : donHangModel;
  isLoaddingOrder = false;
  constructor(
    private commonService :CommonServiceService,
    private modalService : NgbModal,
    private cookieService : CookieService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    if(this.cookieService.check('taikhoanbanhang')){
      this.cookie= this.cookieService.get('taikhoanbanhang')
      this.loginModel =JSON.parse(this.cookie);
      console.log(loginModel);
      this.commonService.getUserByPhone<khachHangModel>(this.loginModel.username).subscribe(data=>{
        this.khachHang= data;
        this.TenKH = this.khachHang.TenKH;
        this.maKH = data.MaKH;
        this.isLoaddingOrder= true;
        this.commonService.getAllOrder<Array<donHangModel>>(this.maKH).subscribe(res=>{
          this.isLoaddingOrder= false;
          this.lstOrder = res;
        });
      })
    }
  }
  openFromDeleteOrder(modal,item){
    this.orderSelected = item;
    this.modalService.open(modal,{ centered: true , backdrop : 'static'});
  }

  DeleteOrder(){
    this.commonService.deleteOrder<objectResult>(this.orderSelected.MAHD).subscribe(res=>{
        if(res){
            if(res.Result===true){
                this.toastr.success('Đã xóa đơn hàng !');
                let index = this.lstOrder.indexOf(this.orderSelected);
                this.lstOrder.splice(index,1);
            }
            else{
                this.toastr.warning('Không xóa được !');
            }
        }
        else{
            this.toastr.warning('Không xóa được !');
        }
    });
  }

  
  convertStatus(input){
    if (input) {
      if (input == 1) {
          return "Mới";
      }
      if (input == 2) {
          return "Đang xác nhận";
      }
      if (input == 3) {
          return "Đã xác nhận";
      }
      if (input == 4) {
          return "Đơn đang chuyển";
      }
      if (input == 5) {
          return "Đơn thành công";
      }
      if (input == 6) {
          return "Đơn thất bại";
      }
      if (input == 7) {
          return "Đơn chuyển hoàn";
      }
      if (input == 8) {
          return "Đơn trả lại";
      }
      if (input == 9) {
          return "Đơn đổi";
      }
      if (input == 10) {
          return "Đơn hủy";
      }
      if (input == 11) {
          return "Đơn hết";
      }
  }
  return "";
  }

}
