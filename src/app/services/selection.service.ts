import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  selection = signal(null)

  constructor() { }
}
