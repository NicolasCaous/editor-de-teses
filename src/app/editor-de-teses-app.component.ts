import { Component } from '@angular/core';
import { TeseComponent } from './components/tese/tese.component';
import { MouseDragService } from './services/mouse-drag.service';

@Component({
  selector: 'edt-app',
  standalone: true,
  imports: [TeseComponent],
  templateUrl: './editor-de-teses-app.component.html',
  styleUrls: ['./editor-de-teses-app.component.scss'],
})
export class EditorDeTesesAppComponent {
  constructor(public mouseDragService: MouseDragService) {}
}
