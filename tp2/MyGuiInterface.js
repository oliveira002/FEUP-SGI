import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
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
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects 
     */
    setContents(contents) {
        this.contents = contents
    }

    /**
     * Initialize the gui interface
     */
    init() {

        // check if there are cameras
        console.log(this.app.cameras)
        if(Array.isArray(this.app.cameras) && Object.keys(this.app.cameras).length){
            const cameraFolder = this.datgui.addFolder('Camera')
            cameraFolder.add(this.app, 'activeCameraName', Object.keys(this.app.cameras)).name("Active camera");
            cameraFolder.open()
        }
    }
}

export { MyGuiInterface };