import * as THREE from 'three';
import { MySpriteSheet } from '../../single/MySpriteSheet.js';

class MyGameSettingsMenu extends THREE.Object3D {

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
        this.diffClick = ["diffLeft", "diffRight"]
        this.trackClick = ["trackLeft", "trackRight"]
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
        this.difficultyTitle = this.spritesheetBlack.createTextGroup("Difficulty:")
        this.difficultyTitle.scale.set(10,10,10)
        this.difficultyTitle.translateX(-3.6)
        this.difficultyTitle.translateY(0)

        this.trackTitle = this.spritesheetBlack.createTextGroup("Track:")
        this.trackTitle.scale.set(10,10,10)
        this.trackTitle.translateX(-2.1)
        this.trackTitle.translateY(-4)

        this.add(this.difficultyTitle, this.trackTitle)

        this.buildDifficulties()
        this.buildTracks()
        this.buildStart()
    }

    handleClick(name) {
        if(this.trackClick.includes(name)) {
            this.changeTrack(name)
        }
        else if (this.diffClick.includes(name)) {
            this.changeDifficulty(name)
        }
    }

    changeDifficulty(name) {
        this.remove(this.activeDifficulty); // Remove the currently active difficulty
    
        if (name === "diffRight") {
            if (this.activeDifficulty === this.easy) {
                this.activeDifficulty = this.normal;
            } else if (this.activeDifficulty === this.normal) {
                this.activeDifficulty = this.hard;
            } else {
                this.activeDifficulty = this.easy;
            }
        } else if (name === "diffLeft") {
            if (this.activeDifficulty === this.easy) {
                this.activeDifficulty = this.hard;
            } else if (this.activeDifficulty === this.normal) {
                this.activeDifficulty = this.easy;
            } else {
                this.activeDifficulty = this.normal;
            }
        }
    
        this.add(this.activeDifficulty);
    }

    changeTrack(name) {
        this.remove(this.activeTrack); 
    
        if (name === "trackRight") {
            if (this.activeTrack === this.track1) {
                this.activeTrack = this.track2;
            } else if (this.activeTrack === this.track2) {
                this.activeTrack = this.track3;
            } else {
                this.activeTrack = this.track1;
            }
        } else if (name === "trackLeft") {
            if (this.activeTrack === this.track1) {
                this.activeTrack = this.track3;
            } else if (this.activeTrack === this.track2) {
                this.activeTrack = this.track1;
            } else {
                this.activeTrack = this.track2;
            }
        }
    
        this.add(this.activeTrack); 
    }

    buildDifficulties() {
        this.easy = this.spritesheetBlack.createTextGroup("easy")
        this.easy.scale.set(10,10,10)
        this.easy.translateX(-1.6)
        this.easy.translateY(-1.5)
        this.easy.name = "easy"
        this.activeDifficulty = this.easy
        this.add(this.activeDifficulty)

        this.hard = this.spritesheetBlack.createTextGroup("hard")
        this.hard.scale.set(10,10,10)
        this.hard.translateX(-1.6)
        this.hard.translateY(-1.5)
        this.hard.name = "hard"

        this.normal = this.spritesheetBlack.createTextGroup("normal")
        this.normal.scale.set(10,10,10)
        this.normal.translateX(-2.3)
        this.normal.translateY(-1.5)
        this.normal.name = "normal"

        this.difficultyArrowLeft = this.spritesheetBlack.createTextGroup("<")
        this.difficultyArrowLeft.name = "diffLeft"
        this.difficultyArrowRight = this.spritesheetBlack.createTextGroup(">")
        this.difficultyArrowRight.name = "diffRight"
        this.diffArrows = [this.difficultyArrowLeft, this.difficultyArrowRight]

        for (var i = 0; i < this.diffArrows.length; i++) {
            this.diffArrows[i].scale.set(10,10,10)
            this.diffArrows[i].translateY(-1.5)
            this.pickableObjs.push(this.diffArrows[i])
        }

        this.difficultyArrowLeft.translateX(-3.1)
        this.difficultyArrowRight.translateX(1.8)

        this.add(this.difficultyArrowLeft, this.difficultyArrowRight)

    }

    buildTracks() {
        this.track1 = this.spritesheetBlack.createTextGroup("Track 1")
        this.track1.scale.set(10,10,10)
        this.track1.translateX(-2.4)
        this.track1.translateY(-5.8)
        this.track1.name = "track1"
        this.activeTrack = this.track1
        this.add(this.activeTrack)

        this.track2 = this.spritesheetBlack.createTextGroup("Track 2")
        this.track2.scale.set(10,10,10)
        this.track2.translateX(-2.4)
        this.track2.translateY(-5.8)
        this.track2.name = "track2"

        this.track3 = this.spritesheetBlack.createTextGroup("Track 3")
        this.track3.scale.set(10,10,10)
        this.track3.translateX(-2.4)
        this.track3.translateY(-5.8)
        this.track3.name = "track3"

        this.trackArrowLeft = this.spritesheetBlack.createTextGroup("<")
        this.trackArrowLeft.name = "trackLeft"
        this.trackArrowRight = this.spritesheetBlack.createTextGroup(">")
        this.trackArrowRight.name = "trackRight"
        this.trackArrows = [this.trackArrowLeft, this.trackArrowRight]

        for (var i = 0; i < this.trackArrows.length; i++) {
            this.pickableObjs.push(this.trackArrows[i])
            this.trackArrows[i].scale.set(10,10,10)
            this.trackArrows[i].translateY(-5.8)
        }

        this.trackArrowLeft.translateX(-3.3)
        this.trackArrowRight.translateX(2.4)
        this.add(this.trackArrowLeft, this.trackArrowRight)
    }

    switchStart(isHover) {
        this.remove(this.activeStart)
        if(isHover) {
            this.activeStart = this.redGroup
        }
        else {
            this.remove(this.activeStart)
            this.activeStart = this.blackGroup
        }
        this.add(this.activeStart)
        
    }
    buildStart() {

        this.blackGroup = new THREE.Group()
        this.blackGroup.name = "Black"

        this.startBlack = this.spritesheetBlack.createTextGroup("Start")
        this.startBlack.scale.set(15,15,15)
        this.startBlack.translateX(-2.6)
        this.startBlack.translateY(-8)

        this.blackGroup.add(this.startBlack)
        this.activeStart = this.blackGroup
        this.pickableObjs.push(this.blackGroup)
        
        this.add(this.activeStart)


        this.redGroup = new THREE.Group()
        this.redGroup.name = "Red"

        this.startRed = this.spritesheetRed.createTextGroup("Start")
        this.startRed.scale.set(15,15,15)
        this.startRed.translateX(-2.6)
        this.startRed.translateY(-8)
        this.redGroup.add(this.startRed)

    }
}

MyGameSettingsMenu.prototype.isGroup = true;

export { MyGameSettingsMenu };