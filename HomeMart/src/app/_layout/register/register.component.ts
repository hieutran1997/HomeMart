import { Component, OnInit } from '@angular/core';
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
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  lastFormGroup: FormGroup;
  cities = [];
  districts = [];
  constructor(
    private _formBuilder: FormBuilder,
    private commonService :CommonServiceService,
    private router:Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.getProvince();
    this.firstFormGroup = this._formBuilder.group({
      TenKH: ['', Validators.required],
      NgaySinh:['', Validators.nullValidator],
      Email:['',Validators.nullValidator],
      SoDienThoai:['',Validators.pattern('[0-9]+[A-Z]?')]
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

  selectedCity(){
    console.log('1',this.secondFormGroup.value.TinhTP);
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
          MaKH : ''
        }
        this.commonService.register<objectResult>(obj).subscribe(data=>{
          if(data.Result){
            alert(data.Message);
            this.router.navigateByUrl('/dang-nhap');
          }
        });
      }
    }
  }
}
