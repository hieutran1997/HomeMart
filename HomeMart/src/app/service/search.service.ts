import { Injectable, Output, EventEmitter } from '@angular/core';
import { ObjectSearchDTO } from '../model/objectSearchDTO';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  @Output() search: EventEmitter<ObjectSearchDTO> = new EventEmitter();
  constructor() { }

  searchByCode(data:any){
    this.search.emit(data);
  }
}
