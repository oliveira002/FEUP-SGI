import * as THREE from 'three';
import { MySpriteSheet } from '../../single/MySpriteSheet.js';

class MyNameMenu extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(app) {
        super();
        this.app = app;
        this.type = 'Group';
        this.spritesheetBlack = new MySpriteSheet(15,8, "images/test2.png");
        this.spritesheetRed = new MySpriteSheet(15,8, "images/test3.png")
        this.pickableObjs = []
        this.name = null
        this.turn = 0
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
        this.playBlack = this.spritesheetBlack.createTextGroup("Name:")
        this.playBlack.scale.set(25,25,25)
        this.playBlack.translateX(-3.4)
        this.playBlack.translateY(-1.5)

        this.arrow = this.spritesheetBlack.createTextGroup(">")
        this.arrow.scale.set(10,10,10)
        this.arrow.translateX(-7.4)
        this.arrow.translateY(-4.5)

        this.activePlay = this.playBlack
        this.pickableObjs.push(this.activePlay)

        this.add(this.playBlack, this.arrow)
    }

    changeName(name) {
        if(this.name) {
            this.remove(this.name)
            this.name = this.spritesheetRed.createTextGroup(name)
            this.name.scale.set(15,15,15)
            this.name.translateX(-6)
            this.name.translateY(-4.5)
            this.add(this.name)
            return
        }
        this.name = this.spritesheetRed.createTextGroup(name)
        this.name.scale.set(15,15,15)
        this.name.translateX(-6)
        this.name.translateY(-4.5)
        this.add(this.name)
    }

    update() {
        const elapsedTime = (Date.now() - this.startTime) / 1000;

        const period = 2; 
        const amplitude = 0.5; 
        const scaleFactor = amplitude * Math.sin(5 * Math.PI * (elapsedTime / period)) + 10.5;
      

        this.arrow.scale.set(scaleFactor, scaleFactor, scaleFactor);
      }
}

MyNameMenu.prototype.isGroup = true;

export { MyNameMenu };