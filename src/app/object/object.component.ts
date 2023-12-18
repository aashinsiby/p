
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
@Component({
  selector: 'app-object',
  standalone: true,
  imports: [],
  templateUrl: './object.component.html',
  styleUrl: './object.component.css'
})
export class ObjectComponent {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  
  renderer = new THREE.WebGLRenderer({ antialias: true });
  model: THREE.Object3D = new THREE.Object3D();
  mixer: THREE.AnimationMixer | null = null;
  animations: THREE.AnimationClip[] = [];
  currentAnimationIndex = 0;
 isLoading: boolean = true;
 
  ngOnInit(): void {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
   
   
    
    controls.update();
   
    // const axesHelper = new THREE.AxesHelper(10); // Adjust the size as needed
    //   this.scene.add(axesHelper);
   
    
    const resizeRendererToDisplaySize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
  
      const aspectRatio = width / height;
      this.camera.aspect = aspectRatio;
      this.camera.updateProjectionMatrix();
  
      this.renderer.setSize((width)/3, height/3);
    };
    
    
    this.renderer.setClearColor(0xffffff);
    
    this.camera.position.set(-1, 3.303, -8.673);
    
    

  window.addEventListener('resize', resizeRendererToDisplaySize);
  resizeRendererToDisplaySize();
 
    const container = document.querySelector('.model-container');
    if (container) {
      container.appendChild(this.renderer.domElement);
    }
    
                      //---------------------------------------------load model--------------------------------
                      const loader = new GLTFLoader();
                      const dracoLoader = new DRACOLoader();
                      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
                      loader.setDRACOLoader(dracoLoader);
                      loader.load('assets/room.glb', (gltf) => {
                        this.model = gltf.scene;
                        this.model.scale.set(.03,.03,.03);;
                        
                        this.scene.add(this.model);
                        this.isLoading = false;
                        
                        // Initialize the mixer for animations
                        this.animations = gltf.animations;
                        if (this.animations.length > 0) {
                          this.mixer = new THREE.AnimationMixer(this.model);
                          const aspectRatio = window.innerWidth / window.innerHeight;




                          // Play the animations once
                      for (let i = 0; i < this.animations.length; i++) {
                                const action = this.mixer.clipAction(this.animations[i]);
                                 // Set the loop mode to play once and repetitions to 1
                                 // Maintain the final state after the animation finishes
                                action.play();
                        }
                        

                    }
                    //rotate the object
      

    });
  
    
    const animate = () => {
      requestAnimationFrame(animate);
      if (this.mixer) { //----------------------------------------------------------------animation
        this.mixer.update(0.01);
       
      }
     
      controls.update();
      this.renderer.render(this.scene, this.camera);
      
    };
   //--------------------------lights---------------------------------------------------
    // const pointLight = new THREE.PointLight(0xffffff, 25, 500);
    // pointLight.position.set(5, 5, 0);
    // this.scene.add(pointLight);

// const pointhelper = new THREE.PointLightHelper(pointLight, 1);
// this.scene.add(pointhelper);

    // const pointLight1 = new THREE.PointLight(0xffffff, 25, 500);
    // pointLight1.position.set(0, 2, 8);
    // this.scene.add(pointLight1);

// const pointhelper1 = new THREE.PointLightHelper(pointLight1, 1);
// this.scene.add(pointhelper1);
    
const amient = new THREE.AmbientLight;
this.scene.add(amient);
 
     animate();
  
  }
 
}
