import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { MouseDragService } from 'src/app/services/mouse-drag.service';

@Component({
  selector: 'edt-tese',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tese.component.html',
  styleUrls: ['./tese.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeseComponent {
  index$ = new BehaviorSubject<string>('0');
  text$ = new BehaviorSubject<string>(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque arcu mi, malesuada et elementum sit amet, congue eleifend elit. Vivamus suscipit imperdiet ex eu tristique. Phasellus orci leo, fermentum eget aliquet nec, venenatis in urna. Morbi ac imperdiet orci. Maecenas convallis rhoncus quam, ut ullamcorper mauris interdum eu. Integer quam arcu, consectetur vitae volutpat non, porta sed felis. Duis vestibulum eros eget nisi vestibulum, a auctor metus euismod. Fusce mi leo, sagittis ut vestibulum a, sollicitudin ac lorem.'
  );

  vm$ = combineLatest({
    index: this.index$.asObservable(),
    text: this.text$.asObservable(),
    latestValuesFromDragService: this.mouseDragService.latestValues$,
  });

  @Input() set index(newIndex: string) {
    this.index$.next(newIndex);
  }

  constructor(public mouseDragService: MouseDragService) {}
}
