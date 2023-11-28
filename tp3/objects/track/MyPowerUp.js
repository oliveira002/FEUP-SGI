import * as THREE from 'three';
import { MyApp } from '../MyApp.js';

class MyPowerUp extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(app) {
        super();
        this.app = app;
        this.type = 'Group';
    }
}

MyPowerUp.prototype.isGroup = true;

export { MyPowerUp };