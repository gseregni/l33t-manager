import { AfterViewInit, Component, computed, effect, ElementRef } from '@angular/core';
import { JsonConfigComponent } from '../json-config/json-config.component';
import { RulerComponent } from '../ruler/ruler.component';
import { SelectionService } from '../../services/selection.service';
import * as THREE from 'three';
import { CommonModule, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-inspector',
  standalone: true,
  imports: [JsonConfigComponent, RulerComponent, JsonPipe, CommonModule],
  templateUrl: './inspector.component.html',
  styleUrl: './inspector.component.scss'
})



export class InspectorComponent implements AfterViewInit {
  baseMaterial = new THREE.MeshToonMaterial();
  selection:any = null;
  scene!: THREE.Scene;
  canvas!: HTMLElement;

  constructor(
    private selectionService:SelectionService,
    elementRef: ElementRef
  ) { 

    effect(() => {
      console.log("selection22")
      this.selection = this.selectionService.selection()
      console.log("this.selection",this.selection)
      
      
      if (this.selection)
        this.createThreeJsBox()

    });
  }


  renderMarkers() {
  }
  
  
  ngAfterViewInit(): void {
  }

  drawMarkers() {
    const box = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), this.baseMaterial);
    this.scene.add( box);


  }


  createThreeJsBox(): void {






    this.canvas = document.getElementById('canvas-box')!;
    this.scene = new THREE.Scene();

    console.log(this.canvas, this.baseMaterial)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.x = 2;
    pointLight.position.y = 2;
    pointLight.position.z = 2;
    this.scene.add(pointLight);


    const canvasSizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const camera = new THREE.PerspectiveCamera(
      75,
      canvasSizes.width / canvasSizes.height,
      0.001,
      1000
    );
    camera.position.z = 5;
    this.scene.add(camera);

    if (!this.canvas) {
      return;
    }

    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
    });
    renderer.setClearColor(0xe232222, 1);
    renderer.setSize(canvasSizes.width, canvasSizes.height);

    window.addEventListener('resize', () => {
      canvasSizes.width = window.innerWidth;
      canvasSizes.height = window.innerHeight;

      camera.aspect = canvasSizes.width / canvasSizes.height;
      camera.updateProjectionMatrix();

      renderer.setSize(canvasSizes.width, canvasSizes.height);
      renderer.render(this.scene, camera);
    });

    const clock = new THREE.Clock();

    const animateGeometry = () => {
      const elapsedTime = clock.getElapsedTime();

      // Update animaiton objects
      // box.rotation.x = elapsedTime;
      // box.rotation.y = elapsedTime;
      // box.rotation.z = elapsedTime;
      // box.position.x = Math.sin(elapsedTime);
      // torus.rotation.x = -elapsedTime;
      // torus.rotation.y = -elapsedTime;
      // torus.rotation.z = -elapsedTime;

      // Render
      renderer.render(this.scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(animateGeometry);
    };

    animateGeometry();
  }



}
