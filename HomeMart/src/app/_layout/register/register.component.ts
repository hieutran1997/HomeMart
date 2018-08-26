import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonServiceService } from '../../service/common-service.service';
import { khachHangModel } from '../../model/khachHangModel';
import { objectResult } from '../../model/objectResult';
import { Router } from '@angular/router';

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
  constructor(
    private _formBuilder: FormBuilder,
    private commonService :CommonServiceService,
    private router:Router,
  ) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      TenKH: ['', Validators.required],
      NgaySinh:['', Validators.nullValidator],
      Email:['',Validators.nullValidator],
      SoDienThoai:['',Validators.pattern('[0-9]+[A-Z]?')]
    });
    this.secondFormGroup = this._formBuilder.group({
      DiaChi: ['', Validators.required],
      TinhTP: ['',Validators.nullValidator]
    });
    this.lastFormGroup = this._formBuilder.group({
      MatKhau:['',Validators.required],
      NhapLaiMatKhau:['',Validators.required]
    });
  }
  save(){
    if(this.lastFormGroup){
      if(this.lastFormGroup.value.MatKhau !== this.lastFormGroup.value.NhapLaiMatKhau){
        alert('Mật khẩu nhập lại không đúng vui lòng kiểm tra lại');
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
