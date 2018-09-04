import { Component, OnInit ,ViewChild} from '@angular/core';
import * as $ from 'jquery';
import {ServiceChatService} from '../../service/service-chat.service';
import { logMessage } from '../../model/logMessage';
import { CookieService } from 'ngx-cookie-service';
import { loginModel } from '../../model/loginModel';
import {NgxAutoScroll} from "ngx-auto-scroll";
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  providers: [ServiceChatService]
})
export class LayoutComponent implements OnInit  {
  @ViewChild(NgxAutoScroll) ngxAutoScroll: NgxAutoScroll;
  cookieValue = 'UNKNOWN';
  cookie ='UNKNOWN';
  title = "Cửa hàng VNXK";
  private appId = "BTSOFT";
  message ;
  email;
  name;
  loginModel : loginModel =null;
  lstYourMessage = [];
  countMessage = 0;
  connnection;
  constructor(
    private chatService :ServiceChatService,
    private cookieService:CookieService,
  ) { }

  public forceScrollDown(): void {
    this.ngxAutoScroll.forceScrollDown();
  }

  ngOnInit() {
    $(document).ready(function(){
      // $('#live-chat header').on('click', function() {
      //   $('.chat').slideToggle(300, 'swing');
      //   $('.chat-message-counter').fadeToggle(300, 'swing');
      // });
      $('.chat-close').on('click', function(e) {
        e.preventDefault();
        // $('#live-chat').fadeOut(300);
        $('.chat').slideToggle(300, 'swing');
        $('.chat-message-counter').fadeToggle(300, 'swing');
      });
    })
    this.chatService.getStatus().subscribe(data=>{
      console.log(data);
    });
    this.chatService.getMessageNew().subscribe(data=>{
      this.countMessage +=1;
      console.log(this.countMessage);
      this.lstYourMessage.push(data);
    });
    this.chatService.resGetMessageNotSeen<number>().subscribe(data=>{
      this.countMessage = data;
      console.log(this.countMessage);
    });
    this.chatService.resGetAllMessage().subscribe(data=>{
      //console.log(data);
      this.lstYourMessage = data;
    });
    if(this.cookieService.check('taikhoanbanhang')){
      this.cookie= this.cookieService.get('taikhoanbanhang')
      this.loginModel =JSON.parse(this.cookie);
      var objDTO = {
        UserName : this.loginModel.username,
      }
      var objGetMessage ={
        AppId: this.appId, 
        Receive: this.loginModel.username,
        SendBy:'cskh'
      }
      this.chatService.connectedSocket(objDTO);
      this.chatService.getMessageNotSeen(objGetMessage);
      this.chatService.getAllMessage(this.loginModel.username);
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
    this.lstYourMessage.push({ContentMessage : this.message , Time : new Date() , SendBy:data.SendBy });
    this.message ='';
    this.chatService.sendMessage(data);
  }
  updateSeenMessage(){
    if(this.loginModel){
      this.chatService.updateSeenMessage(this.loginModel.username);
      this.countMessage = 0;
    }
  }
  displayDate(item) {
    var date = new Date(item.DateTime + ' ' + item.Time);
    return date;
  }
}
