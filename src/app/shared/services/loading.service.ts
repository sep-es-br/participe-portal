import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {

  private loadingSubject: Subject<boolean> = new Subject<boolean>();
  private _loading: boolean = false;
  constructor() { }

  loading(value: boolean = true) {
    this._loading = value;
    this.loadingSubject.next(this._loading);
  }

  isLoading(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }
}