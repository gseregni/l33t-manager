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
  
  boxMaterial = new THREE.MeshPhongMaterial({
    color: 0x333333, //this.getRandomColor(),
    transparent: true,
    opacity: 0.9,
    shininess: 100
  });

  baseMaterial = new THREE.MeshToonMaterial();
  selection: any = null;
  scene!: THREE.Scene;
  @ViewChild('myCanvas') canvas!: ElementRef<HTMLCanvasElement> | undefined;
  controls!: OrbitControls;
  timestamp: number | undefined;
  markers: any[] = [];

  geomCache = new Map<string, THREE.Box3>();


  constructor(
    private selectionService: SelectionService,
    private socketioService: WSService
  ) {

  
    effect(() => {
      this.selection = this.selectionService.selection();
      if (this.selection) {
        // if (this.selection?.binary_image) 
          // this.loadImage();

        
        this.drawMarkers();
        this.loadImage()

        // this.updatePreview();
      }
    });
  }
  
  
  updatePreview() {
  }
  
  ngAfterViewInit(): void {
    this.createThreeJsBox();
    // this.loadImage()
  }

  getRandomColor() {
    return Math.floor(Math.random() * 16777215);
  }

  drawMarkers() {
    // console.log("coordinates", this.selection);  
    this.markers.forEach((marker) => {
      this.scene.remove(marker);
    });

    try {
      this.markers = [];

      this.selection.data.boxes.forEach((box: any) => {
        let box3 = this.geomCache.get(box.id)
        if (!box3) {
          box3 = new THREE.Box3(
            new THREE.Vector3(box[0], box[1], 0),
            new THREE.Vector3(box[2], box[3], 20)
          );  
        }
        

        const center = new THREE.Vector3();
        const size = new THREE.Vector3();
        box3.getCenter(center);
        box3.getSize(size);

        const boxGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
        
        let boxMesh = new THREE.Mesh(boxGeometry, this.boxMaterial);

        // Offset the box slightly along the z-axis
        boxMesh.position.copy(center);
        boxMesh.position.z += 0.1; // Adjust the offset value as needed

        this.scene.add(boxMesh);
        this.markers.push(boxMesh);

      })

  //     const coordinates = [ 10,this.selection.data.boxes[0][1], this.selection.data.boxes[0][0], 10,this.selection.data.boxes[0][2], this.selection.data.boxes[0][3]];
  //     console.log("coordinates", coordinates);  

  //     // Crea un Box3 usando le coordinate
  //   const box3 = new THREE.Box3(
  //     new THREE.Vector3(Number(coordinates[2]) , Number(coordinates[1]), 10),
  //     new THREE.Vector3(Number(coordinates[4]) , Number(coordinates[3]), 10)
  // );

//   const box3 = new THREE.Box3(
//     new THREE.Vector3(465.80035400390625 , 5.1697998046875, 10),
//     new THREE.Vector3(519.2430419921875 , 217.53253173828125, 10)
// );

  // const center = new THREE.Vector3();
  // const size = new THREE.Vector3();
  // box3.getCenter(center);
  // box3.getSize(size);

  // const boxGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);

  // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: false });
  // const boxMesh = new THREE.Mesh(boxGeometry, material);
  // boxMesh.position.copy(center);

  // this.scene.add(boxMesh);




    } catch(e) {

    }
    

  //   const box3 = new THREE.Box3(
  //     new THREE.Vector3(0, 250, 0),
  //     new THREE.Vector3(821, 260, 0)
  // );


   

    if (this.selection && this.selection.markers?.length) {
      this.selection.markers.forEach((marker: any) => {

        
        // setFromCenterAndSize(new THREE.Vector3(marker.center[0], marker.center[1], marker.center[2]), new THREE.Vector3(marker.size[0], marker.size[1], marker.size[2]));

        // const box = new THREE.Mesh(new THREE.BoxGeometry(marker.size[0], marker.size[1], marker.size[2]), this.baseMaterial);

        // Assumi di avere un array di coordinate [x0, y0, z0, x1, y1, z1]
      



        // this.markers.push(box);
        // box.position.x = marker.center[0];
        // box.position.y = marker.center[1];
        // box.position.z = marker.center[2];
        // this.scene.add(box);
      });
    }
  }

 


  loadImage(): void {
    let byteArray = this.socketioService.mediaCache.get("2")
    console.log("byteArray", byteArray)
    let texture = new THREE.DataTexture(byteArray, 640, 360, THREE.RGBAFormat);
    texture.needsUpdate = true;
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const geometry = new THREE.PlaneGeometry(640, 640); // Adjust size as needed
    const plane = new THREE.Mesh(geometry, material);
    plane.position.z = -10;
    plane.position.x = 320;
    plane.position.y = 180;
    this.scene.add(plane);
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
      5000
    );
    camera.position.z = 200;
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
