import * as THREE from 'three';
import { MyMainMenu } from './menus/MyMainMenu.js';
import { MyGameSettingsMenu } from './menus/MyGameSettingsMenu.js';

const StateToIndex = Object.freeze({
    MAIN_MENU: 0,
    CHOOSE_GAME_SETTINGS: 1,
    CHOOSE_CAR_PLAYER: 2,
    CHOOSE_CAR_OPP: 3,
    CHOOSE_OBSTACLE: 4,
	PAUSED: 5,
	END: 6
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
        this.currentMenu = null;
        this.mainMenu = null;
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
        this.add(this.mainMenu)

        this.gameSettingsMenu = new MyGameSettingsMenu(this.app)
        this.gameSettingsMenu.translateX(42)
        this.add(this.gameSettingsMenu)

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
    }

    updateCameraByGameState(newGameState){
        const frustumSize = 20

        let index = StateToIndex[newGameState.toString()]
        this.camera.position.set(42*index, 0, frustumSize /4)
        this.camera.lookAt( new THREE.Vector3(42*index,0,0) );
    }

}

MyMenu.prototype.isGroup = true;

export { MyMenu };