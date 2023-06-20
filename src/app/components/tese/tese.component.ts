import { ChangeDetectionStrategy, Component, ElementRef, Inject, Input, ViewChild } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { BehaviorSubject, combineLatest, filter, startWith, tap } from 'rxjs';
import { GlobalEventService } from 'src/app/services/global-event.service';

@Component({
  selector: 'edt-tese',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tese.component.html',
  styleUrls: ['./tese.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeseComponent {
  @Input() set index(newIndex: string) {
    this.index$.next(newIndex);
  }
  @ViewChild('contentRef') contentRef!: ElementRef<HTMLDivElement>;

  index$ = new BehaviorSubject<string>('0');
  editable$ = new BehaviorSubject<boolean>(false);
  text$ = new BehaviorSubject<string>(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque arcu mi, malesuada et elementum sit amet, congue eleifend elit. Vivamus suscipit imperdiet ex eu tristique. Phasellus orci leo, fermentum eget aliquet nec, venenatis in urna. Morbi ac imperdiet orci. Maecenas convallis rhoncus quam, ut ullamcorper mauris interdum eu. Integer quam arcu, consectetur vitae volutpat non, porta sed felis. Duis vestibulum eros eget nisi vestibulum, a auctor metus euismod. Fusce mi leo, sagittis ut vestibulum a, sollicitudin ac lorem.'
  );
  mouseDownEvent$ = this.globalEventService.mouseDown$.pipe(
    filter((e) => !this.contentRef.nativeElement.contains(e.target as Node)),
    tap(() => this.editable$.next(false)),
    startWith(null)
  );

  vm$ = combineLatest({
    index: this.index$.asObservable(),
    editable: this.editable$.asObservable(),
    text: this.text$.asObservable(),
    clickEvent: this.mouseDownEvent$,
  });

  constructor(public globalEventService: GlobalEventService, @Inject(DOCUMENT) private document: Document) {}

  onDoubleClick() {
    if (!this.editable$.value) {
      this.editable$.next(true);
      setTimeout(() => {
        this.contentRef.nativeElement.blur();
        this.contentRef.nativeElement.focus();

        const range = document.createRange();
        range.selectNodeContents(this.contentRef.nativeElement);

        this.document.defaultView?.getSelection()?.removeAllRanges();
        this.document.defaultView?.getSelection()?.addRange(range);
        this.document.defaultView?.getSelection()?.collapseToEnd();
      }, 10);
    }
  }

  onFocusOut() {
    if (this.editable$.value) {
      this.editable$.next(false);
    }
  }
}
