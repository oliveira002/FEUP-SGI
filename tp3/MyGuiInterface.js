import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import * as THREE from 'three';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface  {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui =  new GUI();
        this.contents = null
        this.wireframeEnabled = false
        this.fogEnabled = true
        this.helpersEnabled = false
        this.controlPointsEnabled = false
        this.initFog = null
        this.ambientColor = {color: 0.1, a: 1}
        this.fogParams = {
            near: 0,
            far: 160,
        };
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects 
     */
    setContents(contents) {
        this.contents = contents;
      }
    
    init() {
        if (Array.isArray(this.app.cameras) && Object.keys(this.app.cameras).length) {
            const cameraFolder = this.datgui.addFolder('Camera');
            cameraFolder.add(this.app, 'activeCameraName', Object.keys(this.app.cameras)).name("Active camera");
            cameraFolder.open();
        }
    }
}
    

export { MyGuiInterface };