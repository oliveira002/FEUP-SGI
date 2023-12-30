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
        this.timeElement = document.getElementById('timeElapsed');
        this.velocityElement = document.getElementById('velocity');
        this.curLapElement = document.getElementById('curLap');
        this.totalLapElement = document.getElementById('totalLap');
        this.velElement = document.getElementById('vel');
        this.rotationsElement = document.getElementById('rotacoes');
        //this.needleElement = document.getElementById('needle');
    }

    updateRotation(velocity) {
        if(velocity < 0) {
            this.rotationsElement.textContent = "R"
        }
        else if(velocity == 0) {
            this.rotationsElement.textContent = "N"
        }
        else if(velocity > 0 && velocity < 20) {
            this.rotationsElement.textContent = "1"
        }
        else if(velocity >= 20 && velocity < 30) {
            this.rotationsElement.textContent = "2"
        }
        else if(velocity >= 30 && velocity < 50) {
            this.rotationsElement.textContent = "3"
        }
        else if(velocity >= 50 && velocity < 70) {
            this.rotationsElement.textContent = "4"
        }
        else if(velocity >= 70 && velocity < 100) {
            this.rotationsElement.textContent = "5"
        }
        else if(velocity >= 100) {
            this.rotationsElement.textContent = "6"
        }
    }

    updateValues() {
        let velocity = this.app.contents.car.speed * 1000;
        velocity = velocity.toFixed(0);
        this.stateElement.textContent = this.app.contents.game.state;
        this.timeElement.textContent = '00:00:01';
        this.velElement.textContent = Math.abs(velocity);
        this.updateRotation(velocity);
        this.curLapElement.textContent = "1";
        this.totalLapElement.textContent = '/' + "3";

        let dashArray = `calc(40 * 3.142 * 1.85 * ${Math.abs(velocity) / 100}) calc(40 * 3.142 * 1.85)`;
        document.querySelector('.purple').style.strokeDasharray = dashArray;
      }
      
    update() {
    this.updateValues();
    }

}

MyHUD.prototype.isGroup = true;

export { MyHUD };