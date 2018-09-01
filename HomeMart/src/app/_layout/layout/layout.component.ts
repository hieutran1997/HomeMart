import { Component, OnInit  } from '@angular/core';
import * as $ from 'jquery';
import {ServiceChatService} from '../../service/service-chat.service';
import { logMessage } from '../../model/logMessage';
import { CookieService } from 'ngx-cookie-service';
import { loginModel } from '../../model/loginModel';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  providers: [ServiceChatService]
})
export class LayoutComponent implements OnInit  {
  cookieValue = 'UNKNOWN';
  cookie ='UNKNOWN';
  title = "Cửa hàng VNXK";
  message ;
  email;
  name;
  loginModel : loginModel =null;
  lstYourMessage = [];
  connnection;
  constructor(
    private chatService :ServiceChatService,
    private cookieService:CookieService,
  ) { }

  ngOnInit() {
    $(document).ready(function(){
      $('#live-chat header').on('click', function() {
        $('.chat').slideToggle(300, 'swing');
        $('.chat-message-counter').fadeToggle(300, 'swing');
      });
      $('.chat-close').on('click', function(e) {
        // e.preventDefault();
        // $('#live-chat').fadeOut(300);
        $('.chat').slideToggle(300, 'swing');
        $('.chat-message-counter').fadeToggle(300, 'swing');
      });
    })
    this.chatService.getStatus().subscribe(data=>{
      console.log(data);
    })
    if(this.cookieService.check('taikhoanbanhang')){
      this.cookie= this.cookieService.get('taikhoanbanhang')
      this.loginModel =JSON.parse(this.cookie);
      var objDTO = {
        UserName : this.loginModel.username,
      }
      this.chatService.connectedSocket(objDTO);
    }
  }

  sendMessage(){
    let data;
    if(this.loginModel){
      data=  new logMessage('',this.loginModel.username,'','',this.message,'','','',this.loginModel.username);
    }
    else{
      if(!this.email || !this.name || this.message){
        alert('Vui lòng điền đủ thông tin !');
        return;
      }
      else{
        data=  new logMessage('',this.name,'','',this.message,'','',this.email,this.name);
      }
    }
    this.lstYourMessage.push({message : this.message , time : new Date()});
    this.message ='';
    this.chatService.sendMessage(data);
  }
}
