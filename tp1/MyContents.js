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
import { MyFurniture } from './MyObjects/MyFurniture.js';
import { MyWindow } from './MyObjects/MyWindow.js';
import { MyShelf } from './MyObjects/MyShelf.js';
import { MyDoor } from './MyObjects/MyDoor.js';
import { MyBeetleCarFrame } from './MyObjects/MyBeetleCarFrame.js';
import { MySpring } from './MyObjects/MySpring.js';
import { MyVase } from './MyObjects/MyVase.js';

import { Reflector } from 'three/addons/objects/Reflector.js';
import { MyCaution } from './MyObjects/MyCaution.js';
import { MyTableCover } from './MyObjects/MyTableCover.js';
import { MyPartyHat } from './MyObjects/MyPartyHat.js';
import { MySpotlight } from './MyObjects/MySpotlight.js';
import { MyFlower } from './MyObjects/MyFlower.js';

import { TTFLoader } from 'three/addons/loaders/TTFLoader.js';
import { Font } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

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
        this.furniture = null
        this.tv = null
        this.window = null
        this.shelf = null
        this.door = null
        this.beetleCarFrame = null
        this.spring = null
        this.vase = null
        this.caution = null

        // axis related attributes
        this.axisEnabled = false

        // box related attributes
        this.boxMesh = null
        this.boxMeshSize = 1.0
        this.boxEnabled = false
        this.lastBoxEnabled = null
        this.boxDisplacement = new THREE.Vector3(0,2,0)

        // floor related attributes
        this.floorSizeU = null
        this.floorSizeV = null
        this.diffuseFloorColor = "#CCCCCC"
        this.specularFloorColor = "#CCCCCC"
        this.floorShininess = 3
        this.floorTexture = new THREE.TextureLoader().load('textures/floor.jpg');
        this.floorTexture.wrapS = THREE.RepeatWrapping;
        this.floorTexture.wrapT = THREE.RepeatWrapping;
        this.floorMaterial = new THREE.MeshPhongMaterial({ 
            map: this.floorTexture,
            transparent: true,
            opacity: 0.9
        })

        // ceiling related attributes
        this.ceilingSize = null
        this.ceilingHeight = null
        this.diffuseCeilingColor = "#FFFFFF"
        this.specularCeilingColor = "#FFFFFF"
        this.ceilingShininess = 0
        this.ceilingMaterial = new THREE.MeshPhongMaterial({ color: this.diffuseCeilingColor, 
            specular: this.specularCeilingColor, emissive: "#000000", shininess: this.ceilingShininess })

        // wall related attributes
        this.wallHeight = null
        this.wallsTexturePath = null

        // table related attributes
        this.tableWidth = null
        this.tableLength = null
        this.tableHeight = null
        this.tableTexturePath = null
        this.tableWallOffset = 0.8

        // chair related attributes
        this.chairWidth = null
        this.chairLength = null
        this.chairHeight = null
        this.chairTexturePath = null
            
        // plate related attributes
        this.plateRadius = null
        this.plateHeight = null

        // cake related attributes
        this.cakeHeight = null
        this.cakeRadius = null
        this.cakeSliceSize = null
        this.cakeInsideTexturePath = null
        this.cakeOutsideTexturePath = null

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
        this.portrait1TexturePath = null 
        
        // portrait2 related attributes
        this.portrait2Width = null
        this.portrait2Length = null
        this.portrait2Depth = null
        this.portrait2TexturePath = null 

        // lamp related attributes
        this.lampHeight = null
        this.isLampOn = null

        // furniture related attributes
        this.furnitureDepth = null
        this.furnitureLength = null
        this.furnitureHeight = null
        this.furnitureTexturePath = null

        // shelf related attributes
        this.shelfDepth = null
        this.shelfLength = null
        this.shelfHeight = null
        this.shelfTexturePath = null

        // tv related attributes
        this.tvWidth = null
        this.tvLength = null
        this.tvDepth = null
        this.tvTexturePath = null
        this.horizontalTvPieceWidth = null
        this.horizontalTvPieceLength = null
        this.verticalTvPieceWidth = null
        this.verticalTvPieceLength = null
        this.diffuseTvColor = null

        // door related attributes
        this.doorWidth = null
        this.doorLength = null
        this.doorDepth = null
        this.doorTexturePath = null
        this.viewTexturePath = null

        // carpet related attributes
        this.carpet = null
        this.carpetTexturePath = null 

        // window related attributes
        this.windowWidth = null
        this.windowLength = null
        this.windowDepth = null
        this.windowTexturePath = null 
        this.horizontalWindowPieceWidth = null
        this.horizontalWindowPieceLength = null
        this.verticalWindowPieceWidth = null
        this.verticalWindowPieceLength = null

        // beetle car frame related attributes
        this.beetleCarFrameLength = null
        this.beetleCarFrameDepth = null
        this.beetleCarBackground = null

        // spring related attributes
        this.springRadius = null


        // vase related attributes

        // caution
        this.cautionWidth = null
        this.cautionHeight = null
        this.cautionDepth = null

        // carpet related attributes
        this.blood = null
        this.bloodTexturePath = null 
        this.bloodSize = 5

        // cover
        this.cover = null
        this.coverWidth = null
        this.coverHeight = null
        this.coverDepth = null
        this.coverTexturePath = null 

        // hats
        this.hats = null
        this.hatRadius = null
        this.hatHeight = null
        this.hatTextures = null
        this.numberHats = 12
        this.minOffset = 0.4
        this.maxOffset = 1.0
        this.zOffset = 0.25
        this.hatsGroup = null

        // vent
        this.vent = null
        this.ventTexturePath = null
        this.ventSize = 2
        this.ventDepth = 0.15

        // box
        this.box = null
        this.boxSize = 1.2
        this.boxTexturePath = null

        //
        this.flower = null
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
       
        const scene = this.app.scene

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555, 0.5 );
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

            this.floorSizeU = 13 // x axis
            this.floorSizeV = 18 // z axis
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

            this.floorMirror = new THREE.PlaneGeometry( this.floorSizeU , this.floorSizeV );
            this.floorMirrorMesh = new Reflector( this.floorMirror, {
                clipBias: 0.003,
                textureWidth: 729,
                textureHeight: 599,
                color: 0xc1cbcb
            });
            this.floorMirrorMesh.rotation.x = -Math.PI / 2;
            this.floorMirrorMesh.position.y = -0.01;
            this.app.scene.add(this.floorMirrorMesh)
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
            this.wallsTexturePath = "textures/wall.png" 
            this.walls = new MyWalls(this, this.wallHeight, this.floorSizeU, this.floorSizeV, this.wallsTexturePath)
            this.walls.translateY(this.wallHeight/2)
            this.app.scene.add(this.walls)
        }
            
        if(this.table === null){
            this.tableWidth = 6
            this.tableLength = 2.5
            this.tableHeight = 1.5
            this.tableTexturePath = "textures/rusty.jpg"
            this.table = new MyTable(this, this.tableWidth, this.tableLength, this.tableHeight, undefined, undefined, this.tableTexturePath)
            this.table.translateY(this.tableHeight/2)
            this.table.translateX(this.floorSizeU / 2 - this.tableLength / 2 - this.tableWallOffset)
            this.table.translateZ(this.floorSizeV / 2 - this.tableWidth / 2)
            this.app.scene.add(this.table)
        }

        if(this.plate === null) {
            this.plateRadius = 0.5
            this.plateHeight = this.plateRadius/5
            this.plate = new MyPlate(this, this.plateRadius, this.plateHeight)
            this.plate.translateY((this.tableHeight+this.plateHeight/2+this.coverHeight))
        }

        if(this.cake === null){
            this.cakeRadius = this.plateRadius*0.8
            this.cakeHeight = this.cakeRadius/2
            this.cakeSliceSize = Math.PI/4
            this.cakeInsideTexturePath = "textures/cake_inside.jpg"
            this.cakeOutsideTexturePath = "textures/cake_outside.jpeg"
            this.cake = new MyCake(this, this.cakeRadius, this.cakeHeight, this.cakeSliceSize, undefined, this.cakeInsideTexturePath, this.cakeOutsideTexturePath)
            this.cake.translateY((this.tableHeight+this.plateHeight+this.cakeHeight/2+this.coverHeight))
        }

        if(this.candle === null){
            this.candleRadius = 0.025
            this.candleHeight = this.candleRadius * 8
            this.candle = new MyCandle(this, this.candleRadius, this.candleHeight)
            this.candle.translateY((this.tableHeight+this.plateHeight+this.cakeHeight+this.candleHeight/2+this.coverHeight))
            this.cakeGroup = new THREE.Group()
            this.cakeGroup.add(this.cake,this.candle,this.plate)
            this.cakeGroup.translateX(this.floorSizeU / 2 - this.tableLength / 2 - this.tableWallOffset)
            this.cakeGroup.translateZ(this.floorSizeV / 2 - this.tableWidth / 2)
            this.app.scene.add(this.cakeGroup)
        }

        if(this.chair === null) {
            this.chairWidth = 0.65
            this.chairLength = 0.65
            this.chairHeight = 0.85
            this.chairTexturePath = "textures/box.jpg"
            this.chair = new MyChair(this, this.chairWidth, this.chairLength, this.chairHeight, undefined, undefined, this.chairTexturePath)
            this.chair2 = new MyChair(this, this.chairWidth, this.chairLength, this.chairHeight, undefined, undefined, this.chairTexturePath)
            this.chair3 = new MyChair(this, this.chairWidth, this.chairLength, this.chairHeight, undefined, undefined, this.chairTexturePath)
            this.chair.translateY(this.chairHeight/2)
            this.chair.translateZ(-this.tableWidth/3)
            this.chair.translateX(-this.tableLength / 6)
            this.chair.rotateY(Math.PI / 4)

            this.chair2.translateY(this.chairWidth + this.chairWidth / 3.5 )
            this.chair2.translateX(this.chairLength * 3)
            this.chair2.rotateY(-Math.PI / 7)
            this.chair2.rotateX(-Math.PI / 2)
            this.chair2.rotateY(Math.PI/2)
            this.chair2.translateX(this.chairWidth / 8)

            this.chair3.translateY(this.chairWidth + this.chairWidth / 4.4)
            this.chair3.translateX(-this.chairLength * 3)
            this.chair3.rotateX(-Math.PI / 2)
            this.chair3.rotateZ(Math.PI / 8)
            this.chair3.translateX(this.chairWidth / 8)
            this.app.scene.add(this.chair,this.chair2,this.chair3)
        }

        if(this.portrait1 === null){
            this.portrait1Width = 2
            this.portrait1Length = 1.5
            this.portrait1Depth = 0.1
            this.portrait1TexturePath = "textures/poster2.jpg" 
            this.framePath = "textures/oldwood.jpg"
            this.portrait1 = new MyPortrait(this, this.portrait1Width, this.portrait1Length, this.portrait1Depth, this.portrait1TexturePath,this.framePath)
            this.portrait1.rotateY(-Math.PI/2)
            this.portrait1.translateX(-(this.portrait1Length/2+this.floorSizeU/20))
            this.portrait1.translateY(this.wallHeight/3);
            this.portrait1.translateZ(-this.floorSizeU/2+this.portrait1Depth/2+0.01)
            this.portrait1.rotateZ(Math.PI / 12)
            this.app.scene.add(this.portrait1)
        }

        if(this.portrait2 === null){
            this.portrait2Width = 2
            this.portrait2Length = 1.5
            this.portrait2Depth = 0.1
            this.portrait2TexturePath = "textures/poster1.jpg" 
            this.framePath = "textures/oldwood.jpg"
            this.portrait2 = new MyPortrait(this, this.portrait2Width, this.portrait2Length, this.portrait2Depth, this.portrait2TexturePath,this.framePath)
            this.portrait2.rotateY(-Math.PI/2)
            this.portrait2.rotateY(Math.PI)
            this.portrait2.translateX(this.portrait2Length/2+this.floorSizeU/20)
            this.portrait2.translateY(this.wallHeight/3);
            this.portrait2.translateZ(-this.floorSizeU/2+this.portrait2Depth/2+0.03)
            this.portrait2.rotateZ(Math.PI / 12)
            this.app.scene.add(this.portrait2)
        }

        if(this.lamp === null){
            this.lampHeight = 2
            this.isLampOn = false
            this.lamp = new MyLamp(this, this.isLampOn, undefined, this.lampHeight)
            this.lamp.translateY(-this.lampHeight/2)
            this.lamp.translateY(this.ceilingHeight)
            this.app.scene.add(this.lamp)
        }

        if(this.furniture === null) {
            this.furnitureHeight = 1
            this.furnitureDepth = 1
            this.furnitureLength = 5
            this.furnitureTexturePath = "textures/box.jpg"
            this.furniture = new MyFurniture(this,this.furnitureHeight,this.furnitureDepth,this.furnitureLength, this.furnitureTexturePath)
            this.furniture.translateY(this.furnitureHeight / 2)
            this.furniture.translateZ(this.floorSizeV / 2 - this.furnitureDepth / 2)
            this.furniture.rotateY(Math.PI)
            this.app.scene.add(this.furniture)
        }

        if(this.tv === null) {
            this.tvWidth = 2
            this.tvLength = 4
            this.tvDepth = 0.02
            this.tvTexturePath = "textures/tv.png"
            this.horizontalTvPieceWidth = this.tvWidth/40
            this.horizontalTvPieceLength = 39*this.tvLength/40
            this.verticalTvPieceWidth = this.tvLength/40
            this.verticalTvPieceLength = 39*this.tvWidth/40
            this.diffuseTvColor = "#000000"
            this.framePath = "textures/furniture.jpg"
            this.tv = new MyPortrait(this,this.tvWidth,this.tvLength,this.tvDepth, this.tvTexturePath, null,
                this.horizontalTvPieceWidth, this.horizontalTvPieceLength, this.verticalTvPieceWidth, this.verticalTvPieceLength, this.diffuseTvColor)
            this.tv.translateY(3.5)
            this.tv.translateZ(this.floorSizeV / 2 - this.tvDepth / 2 - 0.01)
            this.tv.rotateY(Math.PI)
            this.tv.rotateZ(Math.PI / 32)
            this.app.scene.add(this.tv)
        }

        if(this.window === null){
            this.windowWidth = 1.8
            this.windowHeight = 1.5
            this.windowDepth = 0.05
            this.windowTexturePath = "textures/door.png" 
            this.window = new MyWindow(this, this.windowWidth,this.windowHeight,this.windowDepth,this.windowTexturePath)
            this.window.translateY(this.windowHeight / 2 + this.wallHeight / 3)
            this.window.translateZ(this.floorSizeU/2-this.windowDepth/2)
            this.window.translateX(-2)
            this.app.scene.add(this.window)
        }

        if(this.shelf === null) {
            this.shelfHeight = 4.6
            this.shelfDepth = 0.8
            this.shelfLength = 3.6
            this.shelfTexturePath = "textures/furniture.jpg"
            this.shelf = new MyShelf(this,this.shelfHeight * 0.8,this.shelfDepth,this.shelfLength,this.shelfTexturePath)
            this.shelf2 = new MyShelf(this,this.shelfHeight,this.shelfDepth,this.shelfLength,this.shelfTexturePath)
            //this.shelf.translateZ(this.floorSizeV / 2 - this.shelfDepth / 2 )
            //this.shelf.translateX(this.floorSizeV / 4 + 0.2)
            this.shelf.rotateY(Math.PI)
            this.shelf2.translateZ(this.floorSizeV / 2 - this.shelfLength / 2 - 1)
            this.shelf2.translateX(-this.floorSizeU / 2 + this.shelfDepth / 2 + this.ventDepth + 0.01)
            this.shelf2.rotateY(Math.PI)
            this.shelf.translateZ(this.floorSizeV / 2 - this.shelfLength / 3)
            this.shelf.rotateY(-Math.PI / 10)
            this.shelf.rotateX(-Math.PI / 3)
            this.shelf.translateY(0.14)
            this.shelf2.rotateY(-Math.PI / 2)
            this.app.scene.add(this.shelf)
            this.app.scene.add(this.shelf2)
        }

        if(this.door === null) {
            this.doorWidth = 4
            this.doorLength = 2
            this.doorDepth = 0.05
            this.doorTexturePath = "textures/door.png"
            this.viewTexturePath = "textures/view.jpg"
            this.door = new MyDoor(this,this.doorWidth,this.doorLength,this.doorDepth, this.doorTexturePath, this.viewTexturePath)
            this.door.translateY(this.doorWidth / 2)
            this.door.translateZ(-this.floorSizeV / 2 + this.doorDepth / 2)
            this.door.rotateY(Math.PI * 2)
            this.app.scene.add(this.door)
        }

        if(this.carpet === null) {
            this.carpetGeometry = new THREE.PlaneGeometry(this.tableLength * 2.2,this.tableWidth * 2.2)
            this.carpetTexturePath = "textures/carpet.png"

            this.carpetTexture = new THREE.TextureLoader().load(this.carpetTexturePath);
            this.carpetTexture.wrapS = THREE.RepeatWrapping;
            this.carpetTexture.wrapT = THREE.RepeatWrapping;

            this.carpetMaterial = new THREE.MeshPhongMaterial({map : this.carpetTexture})
            this.carpetMesh = new THREE.Mesh(this.carpetGeometry,this.carpetMaterial)
            this.carpetMesh.rotateX(-Math.PI / 2)
            this.carpetMesh.translateZ(0.01)
            //this.app.scene.add(this.carpetMesh)
        }

        if(this.beetleCarFrame === null){
            this.beetleCarFrameLength = 1
            this.beetleCarFrameDepth = 0.1
            this.beetleCarBackground = "textures/beetle_view.jpg"
            this.beetleCarFrame = new MyBeetleCarFrame(this, undefined, 1, this.beetleCarFrameDepth, this.beetleCarBackground)
            this.beetleCarFrame.translateY(this.beetleCarFrameLength/2 + 3 + this.tvWidth/2 + 1)
            this.beetleCarFrame.translateZ(this.floorSizeV / 2 - this.beetleCarFrameDepth / 2 - 0.01)
            this.beetleCarFrame.rotateY(Math.PI)
            this.app.scene.add(this.beetleCarFrame)
        }

        if(this.spring === null){
            this.springRadius = 0.06
            this.spring = new MySpring(this, this.springRadius, 0.5)
            this.spring.translateX(1.2)
            this.spring.translateY(this.springRadius+this.tableHeight)
            this.spring.translateZ(-0.3)
            this.spring.rotateY(Math.PI/3)
            this.app.scene.add(this.spring)
        }

        if(this.vase === null){
            this.vase = new MyVase(this)
            this.vase.translateX(this.furnitureLength/2-0.6)
            this.vase.translateY(this.furnitureHeight)
            this.vase.translateZ(this.floorSizeV/2-this.furnitureDepth/2)
            this.app.scene.add(this.vase)
        }
        
        if(this.caution === null) {
            this.cautionWidth = 0.8
            this.cautionHeight = 1.6
            this.cautionDepth = 0.14
            this.caution = new MyCaution(this,this.cautionWidth,this.cautionDepth,this.cautionHeight)
            this.caution.translateY(Math.sin(Math.PI /3) * (this.cautionHeight / 2))
            this.app.scene.add(this.caution)
        }

        if(this.blood === null) {
            this.bloodGeometry = new THREE.PlaneGeometry(this.bloodSize,this.bloodSize)
            this.bloodTexturePath = "textures/blood.png"

            this.bloodTexture = new THREE.TextureLoader().load(this.bloodTexturePath);
            this.bloodTexture.wrapS = THREE.RepeatWrapping;
            this.bloodTexture.wrapT = THREE.RepeatWrapping;

            this.bloodMaterial = new THREE.MeshPhongMaterial({
                map: this.bloodTexture,
                transparent: true,
                shininess: 80,
                opacity: 0.9,
                specular: 0x440000, 
                emissive: 0x110000, 
              });

            this.blood = new THREE.Mesh(this.bloodGeometry,this.bloodMaterial)
            this.blood.rotateX(-Math.PI / 2)
            this.blood.translateZ(0.03)
            scene.add(this.blood)
        }

        if(this.vent === null) {
            this.ventGeometry = new THREE.BoxGeometry(this.ventSize,this.ventSize,this.ventDepth)
            this.ventTexturePath = "textures/vent.png"

            this.ventTexture = new THREE.TextureLoader().load(this.ventTexturePath);
            this.ventTexture.wrapS = THREE.RepeatWrapping;
            this.ventTexture.wrapT = THREE.RepeatWrapping;

            this.ventMaterial = new THREE.MeshPhysicalMaterial({
                map: this.ventTexture,
                metalness: 0.3
              });

            this.vent = new THREE.Mesh(this.ventGeometry,this.ventMaterial)
            this.vent.rotateY(Math.PI / 2)
            this.vent.translateY(this.ventSize / 2)
            this.vent.translateZ(-this.floorSizeU / 2 + this.ventDepth / 2)
            this.vent.translateX(-this.floorSizeU / 4 - 0.5)
            this.app.scene.add(this.vent)
        }

        if(this.cover === null) {
            this.coverWidth = this.tableLength + 0.1
            this.coverTexturePath = "textures/cover.jpg"
            this.cover = new MyTableCover(this,this.coverWidth,this.tableHeight,this.tableWidth,this.coverTexturePath)
            this.cover.translateY(this.tableHeight + 0.02)
            this.cover.translateX(this.floorSizeU / 2 - this.tableLength / 2 - this.tableWallOffset)
            this.cover.translateZ(this.floorSizeV / 2 - this.tableWidth / 2)
            this.app.scene.add(this.cover)
        }



        const loader = new TTFLoader();

        loader.load( 'fonts/blood.ttf', function ( json ) {

            let bloodFont = new Font( json );
            let textGeo = new TextGeometry( "run away", {
                font: bloodFont,
                size: 1,
                height: 0.002,
                curveSegments: 4,
                bevelThickness: 2,
                bevelSize: 0.01,
                bevelEnabled: false

            } );

            let material = new THREE.MeshPhongMaterial( { color: 0x8b0000, flatShading: true } );
            let textMesh1 = new THREE.Mesh( textGeo, material );

            textMesh1.position.x = 0;
            textMesh1.position.y = 0;
            textMesh1.position.z = 0;

            textMesh1.rotation.x = 0;
            textMesh1.rotation.y = Math.PI * 2;

            scene.add(textMesh1)

        } );

        this.targetGeo = new THREE.PlaneGeometry(0.01, 0.01)
        this.targetMat = new THREE.MeshBasicMaterial({transparent:true})
        this.target = new THREE.Mesh(this.targetGeo, this.targetMat)
        this.target.position.set(2, 3.5, this.floorSizeV / 2 - this.tvDepth / 2 - 0.01)
        this.app.scene.add(this.target)


        this.spotLightPos = new THREE.Vector3(this.floorSizeU/2-0.5,this.ceilingHeight-.53,-this.floorSizeV/2+.3)
        this.spotLightLookAt = this.target.position
        this.spotLightObject = new MySpotlight(this, this.spotLightPos, this.spotLightLookAt)
        this.app.scene.add(this.spotLightObject)

        var cone = new MyPartyHat(this,0.5,1,"textures/partyhat.jpg")
        //this.app.scene.add(cone)

        const spotLight = new THREE.SpotLight( 0xffffff, 700, 0, Math.PI / 4, 0.5, 2);
        var offset = new THREE.Vector3(0,0,0).subVectors(this.spotLightLookAt, this.spotLightPos).normalize()
        offset.multiplyScalar(2)
        spotLight.position.set(...(this.spotLightPos.sub(offset)));
        spotLight.target = this.target
        spotLight.castShadow = true;
        this.app.scene.add(spotLight)

        if(this.hats === null) {
            this.hatsGroup = new THREE.Group()
            this.hatRadius = 0.2
            this.hatHeight = 0.44
            this.hatTextures = ["textures/partyhat.jpg","textures/partyhat2.jpg","textures/partyhat3.jpg","textures/partyhat4.jpg"]
            this.hats = []
            this.hatsSecond = []
            for(let i = 0; i < this.numberHats; i++) {
                var max = this.hatTextures.length
                var randomText = this.randomInteger(0,max - 1)
                var text = this.hatTextures[randomText]
                this.hat = new MyPartyHat(this,this.hatRadius,this.hatHeight,text);
                if(i < this.numberHats / 2) {
                    this.hats.push(this.hat)
                }
                else {
                    this.hatsSecond.push(this.hat)
                }
            }

            let lastOffset = 0
            for(let i = 0; i < this.hats.length; i++) {
                var hat = this.hats[i]
                hat.position.x = this.randomFloat(this.minOffset / 2,this.maxOffset / 2)
                if(i == 0) {
                    this.hatsGroup.add(hat)
                    continue
                }
                lastOffset += this.randomFloat(this.minOffset,this.maxOffset)
                hat.translateZ(-lastOffset)
                this.hatsGroup.add(hat)
            }

            lastOffset = 0
            let xOffset = this.tableLength / 1.5
            for(let i = 0; i < this.hatsSecond.length; i++) {
                var hat = this.hatsSecond[i]
                hat.position.x = -xOffset + this.randomFloat(this.minOffset / 2,this.maxOffset / 2)
                hat.position.z = this.zOffset
                if(i == 0) {
                    this.hatsGroup.add(hat)
                    continue
                }
                lastOffset += this.randomFloat(this.minOffset,this.maxOffset)
                hat.translateZ(-lastOffset)
                this.hatsGroup.add(hat)
            }

            this.hatsGroup.translateY(this.tableHeight + this.coverHeight + this.hatHeight / 2)
            this.hatsGroup.translateX(this.floorSizeU / 2 - this.tableLength / 2 - 1 + this.tableLength/4)
            this.hatsGroup.translateZ(this.floorSizeV / 2 - this.tableWidth / 2 + this.tableWidth / 4)
            this.app.scene.add(this.hatsGroup)
        }

        if(this.box === null) {
            this.boxGeo = new THREE.BoxGeometry(this.boxSize,this.boxSize,this.boxSize)
            this.boxTexturePath = "textures/box.jpg"
            if(this.boxTexturePath){
                this.boxTexture = new THREE.TextureLoader().load(this.boxTexturePath);
                this.boxTexture.wrapS = THREE.RepeatWrapping;
                this.boxTexture.wrapT = THREE.RepeatWrapping;
            }
            this.boxMaterial = new THREE.MeshPhongMaterial({map: this.boxTexture})
            this.box = new THREE.Mesh(this.boxGeo,this.boxMaterial)
            this.box.translateY(this.boxSize / 2)
            this.box.translateX(-1)
            this.box.translateZ(-this.floorSizeU / 3 - 1.24)
            this.box.rotateY(-Math.PI / 10)
            this.app.scene.add(this.box)

        }

        if(this.flower === null) {
            this.flower = new MyFlower(this)
            this.flower.translateX(this.furnitureLength/2-0.6)
            this.flower.translateY(this.furnitureHeight)
            this.flower.translateZ(this.floorSizeV/2-this.furnitureDepth/2 - 0.2)
            this.flower.translateY(1.2)
            this.flower.rotateX(Math.PI / 2)
            this.app.scene.add(this.flower)
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



    randomInteger(min, max) { 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    randomFloat(min, max) {
        const randomNum = Math.random() * (max - min) + min;
        return parseFloat(randomNum.toFixed(2));
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
        if (this.boxEnabled !== this.ltableTopMeshstBoxEnabled) {
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