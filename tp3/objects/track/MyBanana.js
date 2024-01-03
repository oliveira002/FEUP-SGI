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

        const loader = new GLTFLoader();

        loader.load(
            'images/banana_peel_mario_kart.glb',
            (gltf) => {
                var model = gltf.scene
                model.scale.set(0.0015,0.0015,0.0015)
                model.translateY(0.54)
                this.add(model); 
                this.name = "Banana"
            },
            (xhr) => {
                //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.log('An error happened', error);
            }
        );
    }

    getEffect(){
        return this.name
    }
}

MyBanana.prototype.isGroup = true;

export { MyBanana };