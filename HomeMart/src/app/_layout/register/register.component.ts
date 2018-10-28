import { Component, OnInit ,ViewChild,ElementRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonServiceService } from '../../service/common-service.service';
import { khachHangModel } from '../../model/khachHangModel';
import { objectResult } from '../../model/objectResult';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @ViewChild("soDienThoai") sdt : ElementRef;
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  lastFormGroup: FormGroup;
  SoDienThoai :string;
  RegisForDistribution:string;
  cities = [];
  districts = [];
  constructor(
    private _formBuilder: FormBuilder,
    private commonService :CommonServiceService,
    private router:Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    var emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
    this.getProvince();
    this.firstFormGroup = this._formBuilder.group({
      TenKH: ['', Validators.required],
      NgaySinh:['', Validators.nullValidator],
      Email:['', Validators.pattern(emailPattern)],
      SoDienThoai:['',Validators.pattern('[0-9]+[A-Z]?')],
      RegisForDistribution : [false,Validators.nullValidator],
      StoredName:['',Validators.nullValidator]
    });
    
    this.secondFormGroup = this._formBuilder.group({
      DiaChi: ['', Validators.required],
      TinhTP: ['',Validators.nullValidator],
      QuanHuyen: ['',Validators.nullValidator]
    });
    this.lastFormGroup = this._formBuilder.group({
      MatKhau:['',Validators.required],
      NhapLaiMatKhau:['',Validators.required]
    });
  }

  getProvince(){
    this.commonService.getAllProvince().subscribe(data=>{
      if(data){
        this.cities = data;
        this.secondFormGroup.value.QuanHuyen = null;
      }
    })
  }

  changeNumberPhone(ev,data){
    this.commonService.getUserByPhone<khachHangModel>(data).subscribe(res=>{
      if(res&&res.MaKH){
        this.toastr.warning('Số điện thoại đã được đăng ký vui lòng kiểm tra lại !');
        this.sdt.nativeElement.focus();
        this.firstFormGroup.setErrors({ 'invalid': true });
      }
    })
  }

  selectedCity(){
    this.commonService.getDistrictsByCityId(this.secondFormGroup.value.TinhTP).subscribe(res=>{
      if(res){
        this.districts = res;
      }
    })
  }

  save(){
    if(this.secondFormGroup.status !=='VALID' && this.firstFormGroup.status !=='VALID'){
      this.toastr.warning('Vui lòng kiểm tra lại thông tin !');
      return;
    }
    if(this.lastFormGroup){
      if(this.lastFormGroup.value.MatKhau !== this.lastFormGroup.value.NhapLaiMatKhau){
        this.toastr.warning('Mật khẩu nhập lại không đúng vui lòng kiểm tra lại');
        return;
      }
      else{
        let obj = {
          TenKH : this.firstFormGroup.value.TenKH,
          TenKhac : this.firstFormGroup.value.TenKH,
          NgaySinh : this.firstFormGroup.value.NgaySinh,
          Email : this.firstFormGroup.value.Email,
          DienThoai : this.firstFormGroup.value.SoDienThoai,
          DiaChi : this.secondFormGroup.value.DiaChi,
          TinhTP : this.secondFormGroup.value.TinhTP,
          QuanHuyen : this.secondFormGroup.value.QuanHuyen,
          MatKhau : this.lastFormGroup.value.MatKhau,
          MaDonVi : '',
          MaKH : '',
          TenCH:this.firstFormGroup.value.StoredName,
          NPP:this.firstFormGroup.value.RegisForDistribution
        }
        this.commonService.register<objectResult<string>>(obj).subscribe(data=>{
          if(data.Result){
            if(data.Data === "KH_BANLE"){
              this.toastr.success(data.Message);
              this.router.navigateByUrl('/dang-nhap');
            }else{
              alert("Bạn đã đăng ký trở thành nhà phân phối, vui lòng chờ xác nhận từ chúng tôi. Giờ bạn có thể mua hàng với tư cách khách lẻ.");
              this.router.navigateByUrl('/dang-nhap');
            }
          }else{
            this.toastr.warning(data.Message);
          }
        });
      }
    }
  }
}
