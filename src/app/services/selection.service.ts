import { Injectable, signal } from '@angular/core';
import { WSService } from './socketio.service';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  selection = signal(null)

  constructor(
  ) { 
    



  }
}
