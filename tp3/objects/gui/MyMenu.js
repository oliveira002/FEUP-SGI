import * as THREE from 'three';
import { MyMainMenu } from './menus/MyMainMenu.js';
import { MyGameSettingsMenu } from './menus/MyGameSettingsMenu.js';
import { MyNameMenu } from './menus/MyNameMenu.js';
import { MyPauseMenu } from './menus/MyPauseMenu.js';

const StateToIndex = Object.freeze({
    MAIN_MENU: 0,
    NAME_MENU: 1,
    CHOOSE_GAME_SETTINGS: 2,
	PAUSED: 6,
	END: 7
})

class MyMenu extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(app) {
        super();
        this.app = app;
        this.type = 'Group';
        this.positionOffset = 500
        this.currentMenu = null;
        this.mainMenu = null;
        this.nameMenu = null
        this.gameSettingsMenu = null;
        this.pauseMenu = null;
        this.gameOverMenu = null;
        this.currGameState = null;
        this.pickableObjs = [];
        
        this.initMenus()
        this.initCamera()
    }

    initMenus(){

        this.mainMenu = new MyMainMenu(this.app);
        this.mainMenu.translateX(this.positionOffset)
        this.add(this.mainMenu)

        this.nameMenu = new MyNameMenu(this.app)
        this.nameMenu.translateX(this.positionOffset+42)
        this.add(this.nameMenu)

        this.gameSettingsMenu = new MyGameSettingsMenu(this.app)
        this.gameSettingsMenu.translateX(this.positionOffset+84)
        this.add(this.gameSettingsMenu)

        this.pauseMenu = new MyPauseMenu(this.app)
        this.pauseMenu.translateX(this.positionOffset+186)
        this.add(this.pauseMenu)

        this.currentMenu = this.mainMenu
        this.pickableObjs = this.currentMenu.pickableObjs
    }

    initCamera(){
        
        const aspect = window.innerWidth / window.innerHeight;
        const frustumSize = 20

        const left = -frustumSize / 2 * aspect
        const right = frustumSize /2 * aspect 
        const top = frustumSize / 2 
        const bottom = -frustumSize / 2
        const near = -frustumSize /2
        const far =  frustumSize

        this.camera = new THREE.OrthographicCamera( left, right, top, bottom, near, far);
        this.camera.up = new THREE.Vector3(0,1,0);
        this.camera.position.set(0,0,frustumSize /4)
        this.camera.lookAt( new THREE.Vector3(0,0,0) );
        this.app.cameras['Menu'] = this.camera

        this.add(this.camera)

        this.helper = new THREE.CameraHelper( this.camera );
        this.add( this.helper );
    }

    updateCameraByGameState(newGameState){
        const frustumSize = 20

        let index = StateToIndex[newGameState.toString()]

        this.camera.position.set(42*index+this.positionOffset, 0, frustumSize /4)
        this.camera.lookAt( new THREE.Vector3(42*index+this.positionOffset,0,0) );
        console.log("Menu:",this.mainMenu.position,"Cam:",this.camera.position)

        this.remove(this.helper)
        this.helper = new THREE.CameraHelper( this.camera );
        this.add( this.helper );
    }

}

MyMenu.prototype.isGroup = true;

export { MyMenu };