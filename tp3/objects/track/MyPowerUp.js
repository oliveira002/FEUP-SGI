import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { TTFLoader } from 'three/addons/loaders/TTFLoader.js';
import { Font } from 'three/addons/loaders/FontLoader.js';



class MyPowerUp extends THREE.Object3D {
  /**
   * @param {MyApp} app the application object
   */
  constructor(app, radius) {
    super();
    this.app = app;
    var scene = this.app.scene
    this.type = 'Group';
    this.radius = radius || 4; // Use the provided radius or default to 4

    this.material = new THREE.MeshPhysicalMaterial({
        color: 0xadd8e6, // Light blue color
        metalness: 0.0, // Adjust as needed
        roughness: 0.1, // Adjust as needed
        transmission: 0.8, // Simulates glass transparency
        opacity: 0.6,
        transparent: true,
      });
    this.geometry = new THREE.OctahedronGeometry(this.radius);

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.translateY(this.radius)

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
        textMesh.translateY(3.8)
        
        this.textMesh = textMesh;
        this.add(textMesh);
      });

    this.add(this.mesh);
  }

  update() {
    // Rotate the text around the Y-axis
    if (this.textMesh) {
      this.textMesh.rotation.y += 0.01;
    }
  }
}

MyPowerUp.prototype.isGroup = true;

export { MyPowerUp };