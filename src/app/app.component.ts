import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WSService } from './services/ws.service';
import { createEditor, socket } from './rete-editor';
import { ClassicPreset } from 'rete';
import { JsonPipe, NgFor } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgFor, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit {

  
  title = 'h3';
  @ViewChild("rete") container!: ElementRef;
  editor:any = null;

  constructor(public wss:WSService,
    private injector: Injector) {
    this.wss.start()
  }


  ngOnInit(): void {
  
  }

  save() {
    window.localStorage.setItem("l33t", this.editor.editor.toJSON())
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
    this.addFromJson({
      id: "node1",
      name: "Asaasas",
      position: [100, 100],
      inputs: [
        {"key":"a","socket":0}
      ],
      outputs: [
        {"key":"a","socket":0}
      ]
  })
  }

  async addFromJson(config:any) {
    const { name, inputs, outputs } = config;

    // Create a new node with the specified name
    const node = new ClassicPreset.Node(name);

    // // Add controls to the node
    inputs.forEach((output: { key: any; socket:  number; }) => {
      node.addInput(output.key, new ClassicPreset.Input(socket)); // Assuming sockets are globally defined
    });

    // Add outputs to the node
    outputs.forEach((output: { key: any; socket:  number; }) => {
      node.addOutput(output.key, new ClassicPreset.Output(socket)); // Assuming sockets are globally defined
    });

    // Add the node to the editor
    this.editor.addNode(node);
  }


  
  addNode() {

    var a = new ClassicPreset.Node("A");
    a.addControl(
      "a",
      new ClassicPreset.InputControl("text", { initial: "hello" })
    );
    a.addOutput("a", new ClassicPreset.Output(socket));
    this.editor.addNode(a);
  }


  async ngAfterViewInit(): Promise<void> {
    const el = this.container.nativeElement;

    if (el) {
      
     this.editor =  await createEditor(el, this.injector);

     
    //  this.editor.editor.fromJSON(window.localStorage.getItem("l33t"))


    }
  }


}
