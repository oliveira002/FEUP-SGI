import * as THREE from 'three';
import { MyApp } from '../MyApp.js';

class MyRoute extends THREE.Object3D {

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

MyRoute.prototype.isGroup = true;

export { MyRoute };