import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user:string;
  pass:string;
  constructor() { }

  ngOnInit() {
  }
  Login(){
    console.log('user',this.user);
    console.log('pass',this.pass);
  }

}
