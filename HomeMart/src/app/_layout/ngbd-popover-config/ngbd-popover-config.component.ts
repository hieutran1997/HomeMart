import { Component, OnInit } from '@angular/core';
import {NgbPopoverConfig} from '@ng-bootstrap/ng-bootstrap';
import {ViewCartService} from '../view-cart.service';

@Component({
  selector: 'app-ngbd-popover-config',
  templateUrl: './ngbd-popover-config.component.html',
  styles: [],
  providers: [NgbPopoverConfig] // add NgbPopoverConfig to the component providers
})
export class NgbdPopoverConfig{
  quantity : number;
  constructor(config: NgbPopoverConfig,private viewCartService: ViewCartService) {
    // customize default values of popovers used by this component tree
    config.placement = 'bottom';
    config.triggers = 'hover';
  }

  ngOnInit() {
    this.viewCartService.changeCart.subscribe(data => {
      this.quantity = 1;
      console.log(data);
    });
  }
}
