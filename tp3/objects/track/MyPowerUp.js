import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { TTFLoader } from 'three/addons/loaders/TTFLoader.js';
import { Font } from 'three/addons/loaders/FontLoader.js';
import { MyShader } from '../../MyShader.js';
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast, MeshBVHVisualizer } from 'three-mesh-bvh';



class MyPowerUp extends THREE.Object3D {
  /**
   * @param {MyApp} app the application object
   */
  constructor(app, radius) {
    super();
    this.app = app;
    this.type = 'Group';
    this.radius = radius || 5; 
    this.startTime = Date.now();
    this.scaleFactor = 0.1

    THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
    THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
    THREE.Mesh.prototype.raycast = acceleratedRaycast;

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
    this.mesh.geometry.computeBoundsTree();
    this.mesh.scale.set(this.scaleFactor,this.scaleFactor,this.scaleFactor)
            
    console.log(this.mesh)
    let helper = new MeshBVHVisualizer(this.mesh);
    helper.update();
    this.add(helper);

		this.add(this.mesh)
	}

  update() {
    if(this.mesh) {
      const elapsedTime = (Date.now() - this.startTime) / 1000;
      this.mesh.material.uniforms.time.value = elapsedTime
    }
    if (this.textMesh) {
      this.textMesh.rotation.y += 0.01;
    }
  }
}

MyPowerUp.prototype.isGroup = true;

export { MyPowerUp };