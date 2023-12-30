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

        this.stateElement = document.getElementById('state');
        this.timeElement = document.getElementById('time');
        this.velocityElement = document.getElementById('velocity');
        this.lapsElement = document.getElementById('laps');
        this.needleElement = document.getElementById('needle');
    }


    updateValues() {
        let velocity = this.app.contents.car.speed*1000
        velocity = velocity.toFixed(0)
        this.stateElement.textContent = this.app.contents.game.state;
        this.timeElement.textContent = 'top';

        this.velocityElement.textContent = velocity;

        const rotation = -90 + (velocity / 100) * 180;
        needle.style.transform = `translateX(-50%) rotate(${rotation}deg)`;


        this.lapsElement.textContent = "1";
    }

    update() {
        this.updateValues()
    }

}

MyHUD.prototype.isGroup = true;

export { MyHUD };