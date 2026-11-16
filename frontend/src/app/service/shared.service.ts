import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

// <---------------------------- Observable calls ------------------------------->


  private myDataSource = new BehaviorSubject<any>(null);
  myData$ = this.myDataSource.asObservable();
  setData(data: any) {
    this.myDataSource.next(data);
  }

}
