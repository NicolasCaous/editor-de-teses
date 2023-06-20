import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalEventService {
  public mouseDown$ = new ReplaySubject<MouseEvent>(1);

  onMouseDown(e: MouseEvent) {
    this.mouseDown$.next(e);
  }
}
