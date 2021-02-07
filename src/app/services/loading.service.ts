import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  //Loading
  public isLoading: Subject<boolean> = new Subject();

  constructor() { }
}
