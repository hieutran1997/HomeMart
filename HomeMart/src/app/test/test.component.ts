import { Component, OnInit } from '@angular/core';
import {TestService} from '../test.service';    
import{test} from '../test/test.model';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styles: []
})
export class TestComponent implements OnInit {

  message : test

  constructor(private testService : TestService ) { }

  ngOnInit() {
    this.testService.getdata().subscribe(data=>{
      this.message = data;
    })
  }

}
