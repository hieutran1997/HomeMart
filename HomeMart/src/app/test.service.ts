import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {test} from '../app/test/test.model';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  constructor(private http:HttpClient) { }
  url : string = 'http://localhost:50595/api/home/';
  getdata(){
    return this.http.get<test>(this.url);
  }
}
