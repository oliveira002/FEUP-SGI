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
        this.wireframeEnabled = false
        this.fogEnabled = true
        this.initFog = null
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

        console.log(this.contents)

        this.initFog = this.contents.app.scene.fog

        this.datgui.add(this, 'wireframeEnabled').name('Toggle Wireframe').onChange(() => {
            
            let matMap = this.contents.materialMap
            
            Object.keys(matMap).forEach( key => {
                const material = this.contents.materialMap[key];
                if (material) {
                    material.wireframe = this.wireframeEnabled;
                }
            })
        });
        

        this.datgui.add(this, 'fogEnabled').name('Toggle Fog').onChange(() => {
            if(this.fogEnabled) {
                this.contents.app.scene.fog = this.initFog
            }
            else {
                this.contents.app.scene.fog = null
            }
        });

        
    }
}
    

export { MyGuiInterface };