import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonServiceService } from "../../service/common-service.service";
import { NewsModel } from "../../model/NewsModel";
import {Router,NavigationEnd} from '@angular/router';
import {PageEvent} from '@angular/material';
@Component({
  selector: "app-news",
  templateUrl: "./news.component.html",
  styles: []
})
export class NewsComponent implements OnInit {
  title: string;
  news: NewsModel;
  htmlStr: string;
  CreateDate : string;
  lstNews: Array<NewsModel>;
  lstNewsPaging: Array<NewsModel>;
  lstNewsInvolve: Array<NewsModel>;
  lstNewsContainTag : Array<NewsModel>;
  navigationSubscription;
  isLoading = false;
  isListNews = false;
  sortAsc: Boolean = true;
  orderBy : string = 'vt.TENVATTU';
  sortType : string = 'ASC';
  pageEvent: PageEvent;
  datasource: null;
  pageIndex:number;
  pageSize:number;
  length:number;
  path ='';
  listTags = [];
  isFilterTags= false;
  tagsSeleted = "";
  constructor(
    private route: ActivatedRoute,
    private commonService: CommonServiceService,
    private router: Router,
  ) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      this.isListNews = false;
      if (e instanceof NavigationEnd ) {
        this.filterData();
      }
    });
  }

  ngOnInit() {
    this.getListNews();
    this.commonService.getNews("News").subscribe(data => {
      if(data){
        this.lstNews = data;
      }
    });
  }

  getListNews(event?:PageEvent){
    this.commonService.getNewsPaging(event).subscribe(data => {
      if (data) {
        this.lstNewsPaging = data.Data;
        this.pageIndex = data.PageNumber-1;
        this.pageSize = data.PageSize;
        this.length = data.ItemTotal;
      }
    });
  }

  public getServerData(event?:PageEvent){
    this.pageEvent = event;
    
    if(this.isFilterTags===true){
      this.getNewsFilterTags(event);
    }else{
      this.getListNews(event);
    }
  }

  filterData(){
    if (this.route.snapshot.paramMap.get("title")) {
      this.isLoading = true;
      let id = this.route.snapshot.paramMap.get("id");
      if (id) {
        this.commonService.getNewsDetailById(id).subscribe(res => {
          if (res) {
            this.listTags =[];
            if(res.Tags){
              this.listTags = res.Tags.split(',');
            }
            this.title = res.Title;
            this.isLoading = false;
            this.news = res;
            this.htmlStr = this.news.Content;
            this.CreateDate = this.displayDate(this.news.CreateDate);
            this.commonService.getNewsInvolve(this.news.ID,this.news.Tags).subscribe(res=>{
              if(res){
                this.lstNewsInvolve = res;
              }
            })
          }
        });
      }
    }else{
      this.isListNews = true;
    }
  }
  selectTags(item?:string){
    this.isFilterTags = true;
    this.isListNews = true;
    this.tagsSeleted = item;
    this.getNewsFilterTags(null);
  }

  getNewsFilterTags(event?:PageEvent){
    if(this.tagsSeleted){
      this.commonService.getNewsPagingByTags(event,this.tagsSeleted).subscribe(data=>{
        if (data) {
          this.lstNewsPaging = data.Data;
          this.pageIndex = data.PageNumber-1;
          this.pageSize = data.PageSize;
          this.length = data.ItemTotal;
        }
      })
    }
  }

  displayDate(today){
    today = new Date(today);
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd;
    } 
    if(mm<10){
        mm='0'+mm;
    } 
    return dd+'/'+mm+'/'+yyyy;
  }
  convertTitle(item){
    let titleUrl = item.replace(/ /g,"_");
    titleUrl = this.commonService.cleanAccents(titleUrl);
    titleUrl += titleUrl;
    return titleUrl;
  }
}
