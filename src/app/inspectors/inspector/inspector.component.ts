import { AfterViewInit, Component, effect, ElementRef, ViewChild } from '@angular/core';
import { JsonConfigComponent } from '../json-config/json-config.component';
import { RulerComponent } from '../ruler/ruler.component';
import { SelectionService } from '../../services/selection.service';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CommonModule, JsonPipe } from '@angular/common';
import { WSService } from '../../services/socketio.service';

@Component({
  selector: 'app-inspector',
  standalone: true,
  imports: [JsonConfigComponent, RulerComponent, JsonPipe, CommonModule],
  templateUrl: './inspector.component.html',
  styleUrls: ['./inspector.component.scss']
})
export class InspectorComponent implements AfterViewInit {
  baseMaterial = new THREE.MeshToonMaterial();
  selection: any = null;
  scene!: THREE.Scene;
  @ViewChild('myCanvas') canvas!: ElementRef<HTMLCanvasElement> | undefined;
  controls!: OrbitControls;
  timestamp: number | undefined;
  markers: any[] = [];

  constructor(
    private selectionService: SelectionService,
    private socketioService: WSService
  ) {

    
    // this.socketioService.onUpdate(() => {
    //   this.selection = this.selectionService.selection();
    //   console.log("onUpdate", this.selection);
    //   this.drawMarkers();    
    // })
   this.loadImage()
    effect(() => {
      this.selection = this.selectionService.selection();
      if (this.selection) {
        this.drawMarkers();
      }
    });
  }
  
  ngAfterViewInit(): void {
    console.log("CANVAS ", this.canvas);
    this.createThreeJsBox();
  }

  drawMarkers() {

    this.markers.forEach((marker) => {
      this.scene.remove(marker);
    });
    this.markers = [];
    if (this.selection && this.selection.markers?.length) {
      this.selection.markers.forEach((marker: any) => {
        const box = new THREE.Mesh(new THREE.BoxGeometry(marker.size[0], marker.size[1], marker.size[2]), this.baseMaterial);
        this.markers.push(box);
        box.position.x = marker.center[0];
        box.position.y = marker.center[1];
        box.position.z = marker.center[2];
        this.scene.add(box);
      });
    }
  }

  loadImage(): void {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('assets/try.jpg', (texture) => {
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const geometry = new THREE.PlaneGeometry(40, 20); // Adjust size as needed
      const plane = new THREE.Mesh(geometry, material);
      this.scene.add(plane);
    });
  }

  createThreeJsBox(): void {
    if (!this.canvas) {
      return;
    }

    this.scene = new THREE.Scene();
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(2, 2, 2);
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

    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas.nativeElement,
    });
    renderer.setClearColor(0xe232222, 1);
    renderer.setSize(canvasSizes.width, canvasSizes.height);

    this.controls = new OrbitControls(camera, renderer.domElement);
    this.controls.enableDamping = true; // Enable damping (inertia) for smooth controls

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

      this.controls.update(); // Update controls on each frame

      // Render
      renderer.render(this.scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(animateGeometry);
    };

    animateGeometry();
  }
}
