import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../../service/common-service.service';
import { loginModel } from '../../model/loginModel';
import { objectResult } from '../../model/objectResult';
import { Router } from '@angular/router';
import { LoginsuccesService} from '../../service/loginsucces.service';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user:string;
  password:string;
  constructor(
    private commonService :CommonServiceService,
    private router:Router,
    private cookieService :CookieService,
    private loginSuccessService : LoginsuccesService,
    private toastr: ToastrService,
    private modalService : NgbModal,
  ) { }

  ngOnInit() {
  }

  reset(modal){
    this.modalService.open(modal,{ centered: true,size: 'lg'});
  }
  
  Login(){
    if(!this.user || !this.password){
      this.toastr.warning('Vui lòng nhập lại thông tin tài khoản');
      return;
    }
    else{
      let obj:loginModel = {
        username:this.user,
        password:this.password,
        unitcode:"",
        type:""
      }
      this.commonService.login<objectResult<string>>(obj).subscribe(data=>{
        if(data.Result){
          obj.type= data.Data;
          this.cookieService.set('taikhoanbanhang', JSON.stringify(obj),10);
          this.router.navigateByUrl('/');
          this.loginSuccessService.loginSuccesed();
        }
        else if(data.Result===false){
          this.toastr.warning('Tài khoản hoặc mật khẩu không chính xác vui lòng kiểm tra lại !');
        }
      });
    }
  }
}
