import * as THREE from 'three';
import { MyApp } from '../MyApp.js';
import { MyPortrait } from './MyPortrait.js';
import { MyBulb } from './MyBulb.js';


/**
 * This class contains a light representation
 */
class MyDoorLight extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app 
     */
    constructor(app) {
        super();
        this.app = app;
        this.type = 'Group';
        
        this.material= new THREE.MeshPhysicalMaterial({  
            roughness: 0.7,   
            transmission: 1,  
            thickness: 1
          });


        let geometry = new THREE.SphereGeometry(1, 20, 6, 0, 2*Math.PI, 0, 0.5 * Math.PI);

        this.light = new THREE.Mesh(geometry,this.material)
        this.light.rotateX(Math.PI / 2)
        this.light.scale.set(0.3,0.2,0.2)

        this.add(this.light)

    }
}

MyDoorLight.prototype.isGroup = true;

export { MyDoorLight };