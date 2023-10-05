import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyWalls } from './MyObjects/MyWalls.js';
import { MyTable } from './MyObjects/MyTable.js'
import { MyPlate } from './MyObjects/MyPlate.js';
import { MyCake } from './MyObjects/MyCake.js';
import { MyChair } from './MyObjects/MyChair.js';
import { MyCandle } from './MyObjects/MyCandle.js';
import { MyPortrait } from './MyObjects/MyPortrait.js';
import { MyLamp } from './MyObjects/MyLamp.js';
import { MyBulb } from './MyObjects/MyBulb.js';

/**
 *  This class contains the contents of our application
 */
class MyContents {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        
        // objects
        this.app = app
        this.axis = null
        this.floor = null
        this.ceiling = null
        this.walls = null
        this.table = null
        this.plate = null
        this.cake = null
        this.candle = null
        this.chair = null
        this.portrait1 = null
        this.portrait2 = null
        this.lamp = null

        // axis related attributes
        this.axisEnabled = true

        // box related attributes
        this.boxMesh = null
        this.boxMeshSize = 1.0
        this.boxEnabled = false
        this.lastBoxEnabled = null
        this.boxDisplacement = new THREE.Vector3(0,2,0)

        // floor related attributes
        this.floorSizeU = null
        this.floorSizeV = null
        this.diffuseFloorColor = "#d6c6ab"
        this.specularFloorColor = "#d6c6ab"
        this.floorShininess = 0
        this.floorTexture = new THREE.TextureLoader().load('textures/floor.jpg');
        this.floorTexture.wrapS = THREE.RepeatWrapping;
        this.floorTexture.wrapT = THREE.RepeatWrapping;
        this.floorMaterial = new THREE.MeshPhongMaterial({ color: this.diffuseFloorColor, 
            specular: this.specularFloorColor, emissive: "#000000", shininess: this.floorShininess, map: this.floorTexture })
        //this.floorMaterial = new THREE.MeshLambertMaterial({map : this.planeTexture })

        // ceiling related attributes
        this.ceilingSize = null
        this.ceilingHeight = null
        this.diffuseCeilingColor = "#C19A6B"
        this.specularCeilingColor = "#777777"
        this.ceilingShininess = 0
        this.ceilingMaterial = new THREE.MeshPhongMaterial({ color: this.diffuseCeilingColor, 
            specular: this.specularCeilingColor, emissive: "#000000", shininess: this.ceilingShininess })

        // wall related attributes
        this.wallHeight = null

        // table related attributes
        this.tableWidth = null
        this.tableLength = null
        this.tableHeight = null

        // chair related attributes
        this.chairWidth = null
        this.chairLength = null
        this.chairHeight = null
            
        // plate related attributes
        this.plateRadius = null
        this.plateHeight = null

        // cake related attributes
        this.cakeHeight = null
        this.cakeRadius = null
        this.cakeSliceSize = null

        // candle related attributes
        this.candleRadius = null
        this.candleHeight = null
        
        // chair related attributes
        this.chairWidth = null
        this.chairLength = null
        this.chairHeight = null

        // portrait1 related attributes
        this.portrait1Width = null
        this.portrait1Length = null
        this.portrait1Depth = null 
        
        // portrait2 related attributes
        this.portrait2Width = null
        this.portrait2Length = null
        this.portrait2Depth = null

        // lamp related attributes
        this.lampHeight = null
        this.isLampOn = null
    }

    /**
     * builds the box mesh with material assigned
     */
    buildBox() {    
        let boxMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77", 
        specular: "#000000", emissive: "#000000", shininess: 90 })

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(  this.boxMeshSize,  this.boxMeshSize,  this.boxMeshSize );
        this.boxMesh = new THREE.Mesh( box, boxMaterial );
        this.boxMesh.rotation.x = -Math.PI / 2;
        this.boxMesh.position.y = this.boxDisplacement.y;
    }

    /**
     * initializes the contents
     */
    init() {
       
        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555 );
        this.app.scene.add( ambientLight );

        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            
            if(this.axisEnabled === true)
                this.app.scene.add(this.axis)
        }

        // Create the objects
        this.buildBox()
               
        if(this.floor === null){

            this.floorSizeU = 15 // x axis
            this.floorSizeV = 15 // z axis
            let floorUVRate = this.floorSizeV / this.floorSizeU;

            let floorTextureUVRate = 729 / 599; // image dimensions
            let floorTextureRepeatU = 1;
            let floorTextureRepeatV = floorTextureRepeatU * floorUVRate * floorTextureUVRate;
            this.floorTexture.repeat.set(floorTextureRepeatU, floorTextureRepeatV );
            this.floorTexture.rotation = 0;
            this.floorTexture.offset = new THREE.Vector2(0,0);

            this.floor = new THREE.PlaneGeometry( this.floorSizeU , this.floorSizeV );
            this.floorMesh = new THREE.Mesh( this.floor, this.floorMaterial );
            this.floorMesh.rotation.x = -Math.PI / 2;
            this.floorMesh.position.y = 0;
            this.app.scene.add( this.floorMesh );
        }

        if(this.ceiling === null){
            this.ceilingSizeU = this.floorSizeU
            this.ceilingSizeV = this.floorSizeV
            this.ceilingHeight = 10
            this.ceiling = this.floor
            this.ceilingMesh = new THREE.Mesh(this.ceiling,this.ceilingMaterial)
            this.ceilingMesh.rotation.x = Math.PI/2
            this.ceilingMesh.position.y = this.ceilingHeight
            this.app.scene.add(this.ceilingMesh)
        }
        
        if (this.walls === null) {
            this.wallHeight = this.ceilingHeight
            this.walls = new MyWalls(this, this.wallHeight, this.floorSizeU, this.floorSizeV)
            this.walls.translateY(this.wallHeight/2)
            this.app.scene.add(this.walls)
        }

        if(this.table === null){
            this.tableWidth = 1.5
            this.tableLength = 3
            this.tableHeight = 1.5
            this.table = new MyTable(this, this.tableWidth, this.tableLength, this.tableHeight)
            this.table.translateY(this.tableHeight/2)
            this.app.scene.add(this.table)
        }

        if(this.plate === null) {
            this.plateRadius = 0.5
            this.plateHeight = this.plateRadius/5
            this.plate = new MyPlate(this, this.plateRadius, this.plateHeight)
            this.plate.translateY((this.tableHeight+this.plateHeight/2))
            this.app.scene.add(this.plate)
        }

        if(this.cake === null){
            this.cakeRadius = this.plateRadius*0.8
            this.cakeHeight = this.cakeRadius/2
            this.cakeSliceSize = Math.PI/4
            this.cake = new MyCake(this, this.cakeRadius, this.cakeHeight, this.cakeSliceSize)
            this.cake.translateY((this.tableHeight+this.plateHeight+this.cakeHeight/2))
            this.app.scene.add(this.cake)
        }

        if(this.candle === null){
            this.candleRadius = 0.025
            this.candleHeight = this.candleRadius * 8
            this.candle = new MyCandle(this, this.candleRadius, this.candleHeight)
            this.candle.translateY((this.tableHeight+this.plateHeight+this.cakeHeight+this.candleHeight/2))
            this.app.scene.add(this.candle)
        }

        if(this.chair === null) {
            this.chairWidth = 0.65
            this.chairLength = 0.65
            this.chairHeight = 0.85
            this.chair = new MyChair(this, this.chairWidth, this.chairLength, this.chairHeight)
            this.chair.translateY(this.chairHeight/2)
            this.chair.translateZ(-this.tableLength/2)
            this.app.scene.add(this.chair)
        }

        if(this.portrait1 === null){
            this.portrait1Width = 1
            this.portrait1Length = 1.5
            this.portrait1Depth = 0.1
            this.portrait1 = new MyPortrait(this, this.portrait1Width, this.portrait1Length, this.portrait1Depth)
            this.portrait1.rotateY(-Math.PI/2)
            this.portrait1.translateX(-(this.portrait1Length/2+this.floorSizeU/20))
            this.portrait1.translateY(this.wallHeight/5);
            this.portrait1.translateZ(-this.floorSizeV/2+this.portrait1Depth/2+0.01)
            this.app.scene.add(this.portrait1)
        }

        if(this.portrait2 === null){
            this.portrait2Width = 1
            this.portrait2Length = 1.5
            this.portrait2Depth = 0.1
            this.portrait2 = new MyPortrait(this, this.portrait2Width, this.portrait2Length, this.portrait2Depth)
            this.portrait2.rotateY(-Math.PI/2)
            this.portrait2.translateX(this.portrait2Length/2+this.floorSizeU/20)
            this.portrait2.translateY(this.wallHeight/5);
            this.portrait2.translateZ(-this.floorSizeV/2+this.portrait2Depth/2+0.01)
            this.app.scene.add(this.portrait2)
        }

        if(this.lamp === null){
            this.lampHeight = 2
            this.isLampOn = true
            this.lamp = new MyLamp(this, this.isLampOn, undefined, this.lampHeight)
            this.lamp.translateY(-this.lampHeight/2)
            this.lamp.translateY(this.ceilingHeight)
            this.app.scene.add(this.lamp)
        }

    }
    
    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value 
     */
    updateDiffuseFloorColor(value) {
        this.diffuseFloorColor = value
        this.floorMaterial.color.set(this.diffuseFloorColor)
    }
    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value 
     */
    updateSpecularFloorColor(value) {
        this.specularFloorColor = value
        this.floorMaterial.specular.set(this.specularFloorColor)
    }
    /**
     * updates the plane shininess and the material
     * @param {number} value 
     */
    updateFloorShininess(value) {
        this.floorShininess = value
        this.floorMaterial.shininess = this.floorShininess
    }
    
    /**
     * rebuilds the box mesh if required
     * this method is called from the gui interface
     */
    rebuildBox() {
        // remove boxMesh if exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {  
            this.app.scene.remove(this.boxMesh)
        }
        this.buildBox();
        this.lastBoxEnabled = null
    }
    
    /**
     * updates the box mesh if required
     * this method is called from the render method of the app
     * updates are triggered by boxEnabled property changes
     */
    updateBoxIfRequired() {
        if (this.boxEnabled !== this.lastBoxEnabled) {
            this.lastBoxEnabled = this.boxEnabled
            if (this.boxEnabled) {
                this.app.scene.add(this.boxMesh)
            }
            else {
                this.app.scene.remove(this.boxMesh)
            }
        }
    }

    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        // check if box mesh needs to be updated
        this.updateBoxIfRequired()

        // sets the box mesh position based on the displacement vector
        this.boxMesh.position.x = this.boxDisplacement.x
        this.boxMesh.position.y = this.boxDisplacement.y
        this.boxMesh.position.z = this.boxDisplacement.z
        
    }

}

export { MyContents };