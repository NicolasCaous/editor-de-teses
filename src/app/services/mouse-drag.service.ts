import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, combineLatest, distinctUntilChanged, filter, map, shareReplay, startWith, tap } from 'rxjs';

export interface DragEvent {
  node?: Node;
  offset?: number;
}

export interface DragElement {
  event: DragEvent;
  element?: HTMLElement | null | undefined;
  id?: string;
  isEdtContent: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class MouseDragService {
  private dragEvent$ = new BehaviorSubject<DragEvent>({ node: undefined, offset: undefined });
  private latestDrag$ = this.dragEvent$.pipe(
    distinctUntilChanged(
      (prevEvent, currEvent) =>
        prevEvent.offset === currEvent.offset &&
        (prevEvent.node != null && currEvent.node != null ? prevEvent.node.isEqualNode(currEvent.node) : prevEvent.node === currEvent.node)
    ),
    shareReplay(1)
  );

  private isDragging$ = new BehaviorSubject<boolean>(false);

  private dragOrigin$ = new BehaviorSubject<DragEvent>({ node: undefined, offset: undefined });
  private dragOriginElement$ = this.dragOrigin$.pipe<DragElement>(map(this.dragEventToDragElement));

  private dragDestination$ = new BehaviorSubject<DragEvent>({ node: undefined, offset: undefined });
  private dragDestinationElement$ = this.dragDestination$.pipe<DragElement>(map(this.dragEventToDragElement));

  public latestValues$ = combineLatest({
    latestDrag: this.latestDrag$,
    isDragging: this.isDragging$.asObservable(),
    dragOrigin: this.dragOriginElement$,
    dragDestination: this.dragDestinationElement$,
  });

  constructor(@Inject(DOCUMENT) private document: Document) {}

  startDrag(e: MouseEvent) {
    this.isDragging$.next(true);
    this.dragOrigin$.next(this.getTextNodeAndOffset(e.clientX, e.clientY));
  }

  updateDrag(e: MouseEvent) {
    if (this.isDragging$.value) {
      this.dragEvent$.next(this.getTextNodeAndOffset(e.clientX, e.clientY));
    }
  }

  endDrag(e: MouseEvent) {
    if (this.isDragging$.value) {
      this.dragDestination$.next(this.getTextNodeAndOffset(e.clientX, e.clientY));
      this.isDragging$.next(false);
    }
  }

  private getTextNodeAndOffset(x: number, y: number): DragEvent {
    let node;
    let offset;

    // @ts-ignore
    if (this.document.caretPositionFromPoint) {
      // standard
      // @ts-ignore
      let range = document.caretPositionFromPoint(x, y);
      node = range.offsetNode;
      offset = range.offset;
      // @ts-ignore
    } else if (this.document.caretRangeFromPoint) {
      // WebKit
      let range = document.caretRangeFromPoint(x, y);
      node = range?.startContainer;
      offset = range?.startOffset;
    }

    return {
      node,
      offset,
    };
  }

  private dragEventToDragElement(dragEvent: DragEvent): DragElement {
    return {
      event: dragEvent,
      element: dragEvent.node?.parentElement,
      id: dragEvent.node?.parentElement?.id,
      isEdtContent: dragEvent.node?.parentElement?.id != null ? dragEvent.node.parentElement.id.startsWith('edt-content-') : false,
    };
  }
}
