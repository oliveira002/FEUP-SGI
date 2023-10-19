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
        // add a folder to the gui interface for the box
        //const boxFolder = this.datgui.addFolder( 'Box' );
        // note that we are using a property from the contents object 
        //boxFolder.add(this.contents, 'boxMeshSize', 0, 10).name("size").onChange( () => { this.contents.rebuildBox() } );
        //boxFolder.add(this.contents, 'boxEnabled', true).name("enabled");
        //boxFolder.add(this.contents.boxDisplacement, 'x', -5, 5)
        //boxFolder.add(this.contents.boxDisplacement, 'y', -5, 5)
        //boxFolder.add(this.contents.boxDisplacement, 'z', -5, 5)
        //boxFolder.open()
        
        const data = {  
            'diffuse color': this.contents.diffuseFloorColor,
            'specular color': this.contents.specularFloorColor,
        };

        // adds a folder to the gui interface for the floor
        //const floorFolder = this.datgui.addFolder( 'Floor' );
        //floorFolder.addColor( data, 'diffuse color' ).onChange( (value) => { this.contents.updateDiffuseFloorColor(value) } );
        //floorFolder.addColor( data, 'specular color' ).onChange( (value) => { this.contents.updateSpecularFloorColor(value) } );
        //floorFolder.add(this.contents, 'floorShininess', 0, 1000).name("shininess").onChange( (value) => { this.contents.updateFloorShininess(value) } );
        //floorFolder.open();

        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera')
        cameraFolder.add(this.app, 'activeCameraName', 
        [ 'Perspective 1', 
        'Perspective 2', 
        'Floor, Caution Sign and Chairs', 
        'Door',
        'Shelf, Spring and Wall Blood',
        "Table, Cake and Newspaper",
        'Left', 
        'Right', 
        'Top', 
        'Bottom', 
        'Front', 
        'Back'] ).name("active camera");
        // note that we are using a property from the app 
        //cameraFolder.add(this.app.activeCamera.position, 'x', 0, 10).name("x coord")
        cameraFolder.open()
    }
}

export { MyGuiInterface };