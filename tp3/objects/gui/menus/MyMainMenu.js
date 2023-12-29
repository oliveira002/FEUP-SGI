import * as THREE from 'three';
import { MySpriteSheet } from '../../single/MySpriteSheet.js';

class MyMainMenu extends THREE.Object3D {

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
        this.playBlack = this.spritesheetBlack.createTextGroup("Play")
        this.playBlack.scale.set(25,25,25)
        this.playBlack.translateX(-2.5)
        this.playBlack.translateY(-1.5)

        this.activePlay = this.playBlack
        this.pickableObjs.push(this.activePlay)

        this.playRed = this.spritesheetRed.createTextGroup("Play")
        this.playRed.scale.set(25,25,25)
        this.playRed.translateX(-2.5)
        this.playRed.translateY(-1.5)

        this.add(this.playBlack)
    }

    switchStart(isHover) {
        this.remove(this.activePlay)
        if(isHover) {
            this.activePlay = this.playRed
        }
        else {
            this.remove(this.activeStart)
            this.activePlay = this.playBlack
        }
        this.add(this.activePlay)
    }

    buildStart() {
    }
}

MyMainMenu.prototype.isGroup = true;

export { MyMainMenu };