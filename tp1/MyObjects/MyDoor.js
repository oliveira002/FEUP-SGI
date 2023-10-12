import * as THREE from 'three';
import { MyApp } from '../MyApp.js';
import { MyPortrait } from './MyPortrait.js';
import { MyBulb } from './MyBulb.js';




class MyDoor extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {boolean} furnitureHeight the height of the furniture piece relative to the Y axis.
     * @param {number} furnitureDepth the depth of the furniture piece relative to the Z axis.
     * @param {number} furLength the length of the furniture piece relative to the X axis. Default is `4`
     * @param {string} furnitureTexturePath the path of the texture to be used on the furniture. Default `undefined`
     * @param {number} diffuseFurnitureColor the diffuse component of the furniture's color. Default `#EADDCA`
     * @param {number} specularFurnitureColor the specular component of the furniture's color. Default `#EADDCA`
     * @param {number} furnitureShininess the shininess component of the furniture's color. Default `10`
     */
    constructor(app, doorWidth, doorLength, doorDepth, doorTexturePath, knobTexturePath, diffuseDoorColor, specularDoorColor, doorShininess) {
        super();
        this.app = app;
        this.type = 'Group';
        this.doorWidth = doorWidth
        this.doorLength = doorLength || 4
        this.doorDepth = doorDepth
        this.doorTexturePath = doorTexturePath
        this.knobTexturePath = knobTexturePath
        this.diffuseDoorColor = diffuseDoorColor || "#EADDCA"
        this.specularDoorColor = specularDoorColor || "#EADDCA"
        this.doorShininess = doorShininess || 10



        this.frame = new MyPortrait(app,doorWidth,doorLength,doorDepth,doorTexturePath)

        /* Door Knob
        this.knob = new MyBulb(app,false,0.105,this.knobTexturePath)
        this.knob.rotateX(-Math.PI / 2)
        this.knob.translateX(-this.doorLength / 4)
        this.knob.translateZ(0.1)*/

        
        if(this.doorTexturePath){
            this.doorTexture = new THREE.TextureLoader().load(this.doorTexturePath);
            this.doorTexture.wrapS = THREE.RepeatWrapping;
            this.doorTexture.wrapT = THREE.RepeatWrapping;
        }

        this.doorMaterial = new THREE.MeshPhongMaterial({ color: this.diffuseDoorColor, 
            specular: this.specularDoorColor,side: THREE.DoubleSide, emissive: "#000000", shininess: this.doorShininess, map: this.doorTexture })
        
        this.add(this.frame)
    }
}

MyDoor.prototype.isGroup = true;

export { MyDoor };