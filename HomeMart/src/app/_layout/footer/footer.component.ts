import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  redirectFB(){
    let url="https://www.facebook.com/vnxkbanbuonbanle123/";
    window.open(url, '_blank');
  }
}
