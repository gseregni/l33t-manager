import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WSService } from './services/ws.service';
import { createEditor } from './rete-editor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit {
  
  title = 'h3';
  @ViewChild("rete") container!: ElementRef;

  constructor(private wss:WSService,
    private injector: Injector) {
    this.wss.start()
  }


  ngOnInit(): void {
  
  }


  ngAfterViewInit(): void {
    const el = this.container.nativeElement;

    if (el) {
      createEditor(el, this.injector);
    }
  }


}
