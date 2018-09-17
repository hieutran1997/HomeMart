import { Component, OnInit } from '@angular/core';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import {HttpClient} from '@angular/common/http';
import { NewsModel } from '../../model';
import { CommonServiceService } from '../../service/common-service.service';

@Component({
  selector: 'app-ngbd-carousel-config',
  templateUrl: './ngbd-carousel-config.component.html',
  styles: [],
  providers: [NgbCarouselConfig]  // add NgbCarouselConfig to the component providers
})
export class NgbdCarouselConfig  implements OnInit {
  images: Array<NewsModel>;
  isLoading : Boolean = false;
  constructor(
    config: NgbCarouselConfig, 
    private _http: HttpClient,
    private _service :CommonServiceService,
  ) {
    // customize default values of carousels used by this component tree
    config.interval = 10000;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;
  }

  //tỷ lệ 1903x400
  ngOnInit() {
    this.isLoading = true;
    this._service.getImageCover().subscribe(images =>{this.isLoading = false;this.images = images;} );
  }
  
}
