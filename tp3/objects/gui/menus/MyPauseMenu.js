import * as THREE from 'three';
import { MySpriteSheet } from '../../single/MySpriteSheet.js';

class MyPauseMenu extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(app) {
        super();
        this.app = app;
        this.type = 'Group';
        this.spritesheetBlack = new MySpriteSheet(15,8, "images/test2.png");
        this.spritesheetRed = new MySpriteSheet(15,8, "images/test3.png");
        this.pickableObjs = []
        this.startTime = Date.now();
        this.initBackground()
        this.initSpriteSheets()
    }

    initBackground() {
        this.background = new THREE.PlaneGeometry(42,20)
        
        this.bgTex = new THREE.TextureLoader().load('images/main.jpg');
        this.bgTex.wrapS = THREE.RepeatWrapping;
        this.bgTex.wrapT = THREE.RepeatWrapping;

        this.backgroundMaterial = new THREE.MeshPhongMaterial({map: this.bgTex})
        this.backgroundMesh = new THREE.Mesh(this.background, this.backgroundMaterial)
        this.add(this.backgroundMesh)
    
    }

    initSpriteSheets() {
        this.pause = this.spritesheetBlack.createTextGroup("Paused")
        this.pause.scale.set(25,25,25)
        this.pause.translateX(-4)
        this.pause.translateY(-1.5)

        this.space = this.spritesheetBlack.createTextGroup("Press space to resume the game...")
        this.space.scale.set(10,10,10)
        this.space.translateX(-10)
        this.space.translateY(-3.5)


        this.add(this.pause, this.space)
    }

    update() {
        const elapsedTime = (Date.now() - this.startTime) / 1000;

        const period = 2; 
        const amplitude = 0.1; 
        const scaleFactor = amplitude * Math.sin(8 * Math.PI * (elapsedTime / period)) + 10.5;
      

        this.space.scale.set(scaleFactor, scaleFactor, scaleFactor);
    }
}

MyPauseMenu.prototype.isGroup = true;

export { MyPauseMenu };