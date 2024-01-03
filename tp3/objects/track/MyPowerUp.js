import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { TTFLoader } from 'three/addons/loaders/TTFLoader.js';
import { Font } from 'three/addons/loaders/FontLoader.js';
import { MyShader } from '../../MyShader.js';
import { State } from '../../MyGame.js';

class MyPowerUp extends THREE.Object3D {
  /**
   * @param {MyApp} app the application object
   */
  constructor(radius, coords) {
    super();
    this.type = 'Group';
    this.radius = radius || 5;
    this.coords = new THREE.Vector3(...coords)
    this.startTime = Date.now();
    this.scaleFactor = 0.1
    this.effects = ["Speed", "NoClip", "Offroad"]
    this.disabled = false
    this.lastDisabledTime = null
    this.cooldown = 5000

    this.material = new THREE.MeshPhysicalMaterial({
        color: 0xadd8e6,
        metalness: 0.0, 
        roughness: 0.1,
        transmission: 0.8, 
        opacity: 0.6,
        transparent: true,
    });
    
    this.geometry = new THREE.OctahedronGeometry(this.radius);


    this.shader = new MyShader(this.app, 'PowerUp Shader', "PowerUp Shader", "shaders/powerup.vert", "shaders/powerup.frag", {
      time: {type: 'f', value: 0.0 },
    })
    
    this.waitForShaders()

    const loader = new TTFLoader();
    loader.load('fonts/font.ttf', (json) => {
        let bloodFont = new Font(json);
        let textGeo = new TextGeometry('?', {
          font: bloodFont,
          size: 4,
          height: 0.5,
          curveSegments: 4,
          bevelThickness: 2,
          bevelSize: 0.01,
          bevelEnabled: false,
        });
  
        let textMaterial = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: 0xffffff,
        });

        textGeo.computeBoundingBox();
        const textCenter = new THREE.Vector3();
        textGeo.boundingBox.getCenter(textCenter);
        textGeo.translate(-textCenter.x, -textCenter.y, -textCenter.z);

        let textMesh = new THREE.Mesh(textGeo, textMaterial);
        textMesh.scale.set(this.scaleFactor,this.scaleFactor,this.scaleFactor)
        
        this.textMesh = textMesh;
        this.add(this.textMesh);
      });
  }

  waitForShaders() {
		if(this.shader.ready === false) {
			setTimeout(this.waitForShaders.bind(this), 100)
			return;
		}

    this.shader.material.uniforms.baseColor = { type: 'c', value: this.material.color };
    this.shader.material.uniforms.opacity = { type: 'c', value: 0.6};
    this.shader.material.opacity = 0.6
    this.shader.material.transparent = true
    this.mesh = new THREE.Mesh(this.geometry, this.shader.material);
    this.mesh.scale.set(this.scaleFactor,this.scaleFactor,this.scaleFactor)
		this.add(this.mesh)

    this.mesh.geometry.boundingBox = new THREE.Box3().setFromObject(this.mesh).translate(this.coords);


    var boundingBoxMesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true }));
    this.add(boundingBoxMesh);


    this.position.set(...this.coords)
	}


  getEffect(){
    let effect = Math.floor(Math.random() * this.effects.length);
    this.disabled = true
    return this.effects[effect];
  }

  update() {
    if(this.mesh) {
      const elapsedTime = (Date.now() - this.startTime) / 1000;
      this.mesh.material.uniforms.time.value = elapsedTime
    }
    if (this.textMesh) {
      this.textMesh.rotation.y += 0.01;
    }
    //console.log(this)
    this.updateState()

  }

  updateState(){
    this.updateTimer()
    
    if((this.elapsedTime > this.cooldown) && this.disabled){
      this.disabled = false
    }
  }

  startTimer() {
    this.lastDisabledTime = Date.now();
    this.elapsedTime = 0;
    this.updateTimer(); // Update the timer immediately
  }

  stopTimer() {
      if (this.lastDisabledTime !== null) {
          this.elapsedTime += Date.now() - this.lastDisabledTime;
          this.lastDisabledTime = null;
      }
  }

  resumeTimer() {
      if (this.lastDisabledTime === null) {
          this.lastDisabledTime = Date.now();
          this.updateTimer(); // Update the timer immediately
      }
  }

  updateTimer() {
      if (this.lastDisabledTime !== null) {
          const currentTime = Date.now();
          this.elapsedTime += currentTime - this.lastDisabledTime;
          this.lastDisabledTime = currentTime;
      }
  }


  
}

MyPowerUp.prototype.isGroup = true;

export { MyPowerUp };