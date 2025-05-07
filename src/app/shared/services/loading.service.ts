import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {

  private loadingCounter: number = 0;
  private loadingSubject: Subject<boolean> = new Subject<boolean>();
  constructor() { }

  loading(value: boolean = true) {

    if(value) {
      this.loadingCounter++;
    } else {
      this.loadingCounter--;
    }

    this.loadingCounter = Math.max(this.loadingCounter, 0);

    this.loadingSubject.next(this.loadingCounter > 0);
  }

  isLoading(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }
}