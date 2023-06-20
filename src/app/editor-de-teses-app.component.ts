import { Component } from '@angular/core';
import { TeseComponent } from './components/tese/tese.component';
import { GlobalEventService } from './services/global-event.service';

@Component({
  selector: 'edt-app',
  standalone: true,
  imports: [TeseComponent],
  templateUrl: './editor-de-teses-app.component.html',
  styleUrls: ['./editor-de-teses-app.component.scss'],
})
export class EditorDeTesesAppComponent {
  constructor(public globalEventService: GlobalEventService) {}
}
