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

        const helperFolder = this.datgui.addFolder('Visualization');

        helperFolder.add(this, 'wireframeEnabled').name('Toggle Wireframe').onChange(() => {
            
            let matMap = this.contents.materialMap
            
            Object.keys(matMap).forEach( key => {
                const material = this.contents.materialMap[key];
                if (material) {
                    material.wireframe = this.wireframeEnabled;
                }
            })
        });

        helperFolder.add(this, 'helpersEnabled').name('Toggle Light Helpers').onChange(() => {
            this.contents.helpersOn = this.helpersEnabled
            this.contents.displayHelpers()
        });
        

        const fogFolder = this.datgui.addFolder('Fog Parameters');

        this.initFog = this.contents.app.scene.fog

        fogFolder.add(this, 'fogEnabled').name('Toggle Fog').onChange(() => {
            if(this.fogEnabled) {
                this.contents.app.scene.fog = this.initFog
            }
            else {
                this.contents.app.scene.fog = null
            }
        });


        fogFolder.add(this.fogParams, 'near', 0.1, 1000).name('Near').onChange(() => {
            this.updateFog();
        });

        fogFolder.add(this.fogParams, 'far', 100, 5000).name('Far').onChange(() => {
            this.updateFog();
        });

        const ambientFolder = this.datgui.addFolder('Ambient Color');

        ambientFolder.add(this.ambientColor, 'color', 0, 1).name('color').onChange(() => {
            this.updateAmbientLightColor();
        });
    }

    updateFog() {
        if (this.app.scene.fog != null && this.app.scene.fog != undefined ) {
            this.app.scene.fog.near = this.fogParams.near;
            this.app.scene.fog.far = this.fogParams.far;
        }
    }

    updateAmbientLightColor() {
        let color = new THREE.Color(this.ambientColor.color, this.ambientColor.color, this.ambientColor.color);
        color = new THREE.Color(color.getHex(THREE.LinearSRGBColorSpace))
        this.contents.app.scene.children[0].color = color
    }
}
    

export { MyGuiInterface };