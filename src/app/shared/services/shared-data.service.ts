import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private pathEscenaSubject = new BehaviorSubject<string | null>(null);

  constructor() { }

  setPathEscena(path: string): void {
    this.pathEscenaSubject.next(path);
  }

  getPathEscena$() {
    return this.pathEscenaSubject.asObservable();
  }

}
