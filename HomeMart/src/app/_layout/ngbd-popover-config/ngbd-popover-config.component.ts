import { Component, OnInit } from '@angular/core';
import {NgbPopoverConfig} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-ngbd-popover-config',
  templateUrl: './ngbd-popover-config.component.html',
  styles: [],
  providers: [NgbPopoverConfig] // add NgbPopoverConfig to the component providers
})
export class NgbdPopoverConfig{

  constructor(config: NgbPopoverConfig) {
    // customize default values of popovers used by this component tree
    config.placement = 'bottom';
    config.triggers = 'hover';
  }
}
