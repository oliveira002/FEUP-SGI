import * as THREE from 'three';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';



class MyHUD extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(app) {
        super();
        this.app = app;
        this.type = 'Group';

        // Reference HTML elements
        this.stateElement = document.getElementById('state');
        this.timeElement = document.getElementById('time');
        this.velocityElement = document.getElementById('velocity');
        this.lapsElement = document.getElementById('laps');
    }

    updateValues() {
        const velocity = this.app.contents.car.speed.toFixed(2);
        
        this.stateElement.textContent = "ola";
        this.timeElement.textContent = 'top';
        this.velocityElement.textContent = velocity;
        this.lapsElement.textContent = "1";
    }

    update() {
        this.updateValues()
    }

}

MyHUD.prototype.isGroup = true;

export { MyHUD };