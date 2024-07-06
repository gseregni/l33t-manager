import { AfterViewInit, Component, ElementRef, Injector, OnInit, TrackByFunction, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WSService } from './services/ws.service';
import { createEditor, socket } from './rete-editor';
import { ClassicPreset } from 'rete';
import { JsonPipe, NgFor } from '@angular/common';
import { RulerComponent } from './inspectors/ruler/ruler.component';
import { InspectorComponent } from './inspectors/inspector/inspector.component';
import { SelectionService } from './services/selection.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgFor,JsonPipe, RulerComponent, InspectorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  
  title = 'h3';
  @ViewChild("rete") container!: ElementRef;
  editor:any = null;
  selection: any|null = null;

  constructor(public wss:WSService,
    private selectionService:SelectionService,
    private injector: Injector) {
    this.wss.start()
  }


  ngOnInit(): void {
  
  }

  save() {
    // window.localStorage.setItem("l33t", this.editor.editor.toJSON())
  }
    

  identify: TrackByFunction<any> = (index, item) => item.id;

  setSelection(a:any): void {
    console.log("setSelection", a)
    this.selectionService.selection.set(a)
  }


  async addNodeFromJson(json:any) {

      const { id, name, position, inputs, outputs } = json;
  
      // Create a new node with the specified component
      // const component = this.editor.components.get(name); 
      // if (!component) throw `Component ${name} not found`;
  
      const node = await this.editor.createNode();
  
      // Set node properties
      node.id = id;
      node.position = position;
      Object.keys(inputs).forEach(inputKey => {
          node.inputs.get(inputKey).connections = inputs[inputKey].connections;
      });
      Object.keys(outputs).forEach(outputKey => {
          node.outputs.get(outputKey).connections = outputs[outputKey].connections;
      });
  
      this.editor.addNode(node);

  }
  

  addNode2() {
    this.wss.tree.areas[0].agents.forEach((agent:any) => {
      this.addFromJson(agent)
    })
    

  //   this.addFromJson({
  //     id: "node1",
  //     name: "Asaasas",
  //     position: [100, 100],
  //     inputs: [
  //       {"key":"a","socket":0}
  //     ],
  //     outputs: [
  //       {"key":"a","socket":0}
  //     ]
  //  })
  }

  async addFromJson(config:any) {
    // const { name, inputs, outputs } = config;
    let name = "Agent" + config.id + " - " + config.type
    // Create a new node with the specified name
    const node = new ClassicPreset.Node(name);

    // // Add controls to the node
    config.inputs.forEach((output: { key: any; socket:  number; }) => {
      node.addInput(output.key, new ClassicPreset.Input(socket)); // Assuming sockets are globally defined
    });

    // Add outputs to the node
    config.outputs.forEach((output: { key: any; socket:  number; }) => {
      node.addOutput(output.key, new ClassicPreset.Output(socket)); // Assuming sockets are globally defined
    });

    // Add the node to the editor
    this.editor.addNode(node);
  }


  
  addNode() {

    // var a = new ClassicPreset.Node("A");
    // a.addControl(
    //   "a",
    //   new ClassicPreset.InputControl("text", { initial: "hello" })
    // );
    // a.addOutput("a", new ClassicPreset.Output(socket));
    // this.editor.addNode(a);
  }


  // async ngAfterViewInit(): Promise<void> {
  //   // const el = this.container.nativeElement;

  //   // if (el) {
      
  //   //  this.editor =  await createEditor(el, this.injector);

     
  //   // //  this.editor.editor.fromJSON(window.localStorage.getItem("l33t"))


  //   // }
  // }


}
