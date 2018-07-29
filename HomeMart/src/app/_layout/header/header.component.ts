import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  listMenu = [
    { Title : 'Trang chủ' , url : '/'},
    { Title : 'Nam', url: '/Nam'},
    { Title : 'Nữ', url: '/Nu'}
  ];

  constructor() { }

  ngOnInit() {

  }

}
