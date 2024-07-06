import { Component, effect } from '@angular/core';
import { JsonConfigComponent } from '../json-config/json-config.component';
import { RulerComponent } from '../ruler/ruler.component';
import { SelectionService } from '../../services/selection.service';

@Component({
  selector: 'app-inspector',
  standalone: true,
  imports: [JsonConfigComponent, RulerComponent],
  templateUrl: './inspector.component.html',
  styleUrl: './inspector.component.scss'
})


export class InspectorComponent {
  
  selection:any = null;

  constructor(
    selectionService:SelectionService
  ) { 

    effect(() => {
      this.selection = selectionService.selection
      
    });
  }

}
