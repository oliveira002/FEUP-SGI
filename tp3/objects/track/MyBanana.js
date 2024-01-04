import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class MyBanana extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(app) {
        super();
        this.app = app;
        this.type = 'Group';
        this.boundingBox = new THREE.Box3(); // Initialize an empty bounding box
        this.boundingBoxHelper = new THREE.Box3Helper(this.boundingBox, 0xffff00); // Create a yellow bounding box helper

        const loader = new GLTFLoader();

        loader.load(
            'images/banana_peel_mario_kart.glb',
            (gltf) => {
                var model = gltf.scene;
                model.scale.set(0.0015, 0.0015, 0.0015);
                model.translateY(0.24);
                this.add(model);

                // Calculate and set the bounding box
                this.updateBoundingBox();

                this.name = "Banana";

                // Add bounding box helper to the scene
                //this.add(this.boundingBoxHelper);
            },
            (xhr) => {
                //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.log('An error happened', error);
            }
        );
    }

    // Function to update the bounding box based on the children's geometry
    updateBoundingBox() {
        this.boundingBox.setFromObject(this);
    }

    getEffect() {
        return this.name;
    }
}

MyBanana.prototype.isGroup = true;

export { MyBanana };