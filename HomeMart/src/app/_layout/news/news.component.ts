import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonServiceService } from "../../service/common-service.service";
import { NewsModel } from "../../model/NewsModel";
import {Router,NavigationEnd} from '@angular/router';
@Component({
  selector: "app-news",
  templateUrl: "./news.component.html",
  styles: []
})
export class NewsComponent implements OnInit {
  title: string;
  news: NewsModel;
  htmlStr: string;
  lstNews: Array<NewsModel>;
  navigationSubscription;
  isLoading = false;
  constructor(
    private route: ActivatedRoute,
    private commonService: CommonServiceService,
    private router: Router,
  ) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd ) {
        this.filterData();
      }
    });
  }

  ngOnInit() {
    this.isLoading = true;
    this.filterData();
    this.commonService.getNews("News").subscribe(data => {
      if (data) {
        this.lstNews = data;
      }
    });
  }
  filterData(){
    if (this.route.snapshot.paramMap.get("title")) {
      this.title = this.route.snapshot.paramMap.get("title");
      if (this.title) {
        this.commonService.getNewsDetailByTitle(this.title).subscribe(res => {
          if (res) {
            this.isLoading = false;
            this.news = res;
            this.htmlStr = this.news.Content;
          }
        });
      }
    }
  }
}
