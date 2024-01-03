import * as THREE from 'three';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { State } from '../../MyGame.js';
import { MyPodium } from '../scenery/MyPodium.js';



class MyHUD extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(app, difficulty) {
        super();
        this.app = app;
        this.type = 'Group';

        this.startTime = null;
        this.elapsedTime = 0; // to keep track of the elapsed time
        this.maxSpeed = 100
        this.difficulty = difficulty

        this.overlay = document.getElementById('overlay');
        this.stateElement = document.getElementById('state');
        this.timeElement = document.getElementById('timeElapsed');
        this.velocityElement = document.getElementById('velocity');
        this.curLapElement = document.getElementById('curLap');
        this.totalLapElement = document.getElementById('totalLap');
        this.velElement = document.getElementById('vel');
        this.rotationsElement = document.getElementById('rotacoes');
        this.powerups = ["Speed","NoClip", "Offroad"]
        this.difficultyMap = {"easy": 3, "normal": 2, "hard": 1}

        this.modelMap = {"Nissan S15": "Lambo", "Lambo": "Nissan S15"}

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
        this.curLapElement.textContent = this.app.contents.car.lap;
        this.totalLapElement.textContent = '/' + "3";

        let dashArray = `calc(40 * 3.142 * 1.85 * ${Math.abs(velocity) / (this.app.contents.car.maxmaxspeed * 1000)}) calc(40 * 3.142 * 1.85)`;
        document.querySelector('.purple').style.strokeDasharray = dashArray;
      }
      
    update(state) {
        this.updateHud(state)
        this.updateTimer()
        this.checkWinner()
    }

    updateHud(state) {
        const hudElement = document.getElementById('hud');
        if (state !== 'PLAYING') {
            hudElement.style.display = 'none';
        } else {
            hudElement.style.display = 'block';
            this.updateValues();
            this.updateEffects()
            this.checkWinner()
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
    
    checkWinner() {
        if((this.elapsedTime/ 1000) >= 20 * this.difficultyMap[this.difficulty] * 3 ) {
            this.stopTimer()
            this.loser = [this.app.contents.name ,this.app.contents.car.model, this.elapsedTime/1000]
            this.winner = ["Bot - " + this.app.contents.botDifficulty, this.modelMap[this.app.contents.car.model], 20 * this.difficultyMap[this.difficulty] * 3]
            this.app.contents.game.state = State.END
            this.app.contents.createPodium(this.winner, this.loser, 20 * this.difficultyMap[this.difficulty] * 3)
        }
        if(this.app.contents.car.lap >= 4) {
            this.stopTimer()
            this.winner = [this.app.contents.name ,this.app.contents.car.model, this.elapsedTime/1000]
            this.loser = ["Bot - " + this.app.contents.botDifficulty, this.modelMap[this.app.contents.car.model], 20 * this.difficultyMap[this.difficulty] * 3]
            this.app.contents.game.state = State.END
            this.app.contents.createPodium(this.winner, this.loser, this.elapsedTime)
        }
    }

    

    updateEffects() {
        this.resetDivs()
        const overlayDiv = document.getElementById('overlay');
        const effectsArray = this.app.contents.car.effects;

        effectsArray.forEach((e, i) => {
            const effectId = e.name;
            const name = this.mapNames(e)
            const existingDiv = document.getElementById(effectId);

            var time = 0
            if(this.powerups.includes(e.name)) {
                 time = (10000 - e.elapsedTime) / 1000;
            }
            else {
                 time = (5000 - e.elapsedTime) / 1000;
            }
    
            if (existingDiv) {
                existingDiv.textContent = `Effect: ${name}, Time Elapsed: ${time}`;
            } else {
                const newElement = document.createElement('div');
                newElement.id = effectId;
                newElement.textContent = `Effect: ${name}, Time Elapsed: ${time}`;
                overlayDiv.appendChild(newElement);
            }
        });
    }

    resetDivs() {
        const divsEffects = [
            document.getElementById("Speed"),
            document.getElementById("NoClip"),
            document.getElementById("Offroad"),
            document.getElementById("Oil"),
            document.getElementById("Caution"),
            document.getElementById("Banana")
        ];
    
        divsEffects.forEach((div) => {
            if (div) {
                const timeInText = parseInt(div.textContent.match(/\d+/)); // Extract numeric value from text
    
                if (timeInText <= 0) {
                    // Remove the div if the time is <= 0
                    div.remove();
                }
            }
        });
    }

    mapNames(e) {
        switch(e.name){
            case "Speed":{
                return "Extra Speed"
            }
            case "NoClip":{
                return "No Collisions"
            }
            case "Offroad":{
               return "Off Road"
            }
            case "Oil":{
               return "No Brakes"
            }
            case "Caution":{
               return "Inverted Controls"
            }
            case "Banana":{
                return "Reduced Speed"
            }
        }
    }
}

MyHUD.prototype.isGroup = true;

export { MyHUD };