import { Component, OnInit } from '@angular/core';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-ngbd-carousel-config',
  templateUrl: './ngbd-carousel-config.component.html',
  styles: [],
  providers: [NgbCarouselConfig]  // add NgbCarouselConfig to the component providers
})
export class NgbdCarouselConfig  implements OnInit {
  images: Array<string>;
  isLoading : Boolean = false;
  constructor(config: NgbCarouselConfig, private _http: HttpClient) {
    // customize default values of carousels used by this component tree
    config.interval = 10000;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;
  }
  ngOnInit() {
    this.isLoading = true;
    this._http.get('https://picsum.photos/list')
        .pipe(map((images: Array<{id: number}>) => this._randomImageUrls(images)))
        .subscribe(images =>{this.isLoading = false;this.images = images;} );
  }
  private _randomImageUrls(images: Array<{id: number}>): Array<string> {
    return [1, 2, 3, 4].map(() => {
      const randomId = images[Math.floor(Math.random() * images.length)].id;
      return `https://picsum.photos/1903/400?image=${randomId}`;
    });
  }
  
}
