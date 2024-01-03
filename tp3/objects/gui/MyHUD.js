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

        this.maxSpeed = 200
        this.startTime = null;
        this.elapsedTime = 0; // to keep track of the elapsed time

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

        let dashArray = `calc(40 * 3.142 * 1.85 * ${Math.abs(velocity) / this.maxSpeed}) calc(40 * 3.142 * 1.85)`;
        document.querySelector('.purple').style.strokeDasharray = dashArray;
      }
      
    update(state) {
        this.updateHud(state)
        this.updateTimer()
    }

    updateHud(state) {
        const hudElement = document.getElementById('hud');
        if (state !== 'PLAYING') {
            hudElement.style.display = 'none';
        } else {
            hudElement.style.display = 'block';
            this.updateValues();
        }
    }

    startTimer() {
        this.startTime = Date.now();
        this.elapsedTime = 0;
        this.updateTimer(); // Update the timer immediately
    }

    stopTimer() {
        if (this.startTime !== null) {
            this.elapsedTime += Date.now() - this.startTime;
            this.startTime = null;
        }
    }

    resumeTimer() {
        if (this.startTime === null) {
            this.startTime = Date.now();
            this.updateTimer(); // Update the timer immediately
        }
    }

    updateTimer() {
        if (this.startTime !== null) {
            const currentTime = Date.now();
            this.elapsedTime += currentTime - this.startTime;
            this.startTime = currentTime;
        }

        const seconds = Math.floor(this.elapsedTime / 1000) % 60;
        const minutes = Math.floor(this.elapsedTime / (1000 * 60)) % 60;
        const hours = Math.floor(this.elapsedTime / (1000 * 60 * 60));

        const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        this.timeElement.textContent = formattedTime;
    }

}

MyHUD.prototype.isGroup = true;

export { MyHUD };