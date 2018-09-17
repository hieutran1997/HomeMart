import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../../service/common-service.service';
import { NewsModel } from '../../model';

@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.component.html',
  styles: []
})
export class InfoPageComponent implements OnInit {
  htmlStr: string ='';
  title : string ='';
  news:Array<NewsModel>;
  constructor(
    private _service : CommonServiceService,
  ) { }

  ngOnInit() {
    this._service.getNews('Infomation').subscribe(res=>{
      this.news= res;
      this.htmlStr = this.news[0].Content;
      this.title = this.news[0].Title;
    });
  }

}
