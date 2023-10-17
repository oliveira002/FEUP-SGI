import * as THREE from 'three';
import { MyApp } from '../MyApp.js';
import { MyPortrait } from './MyPortrait.js';
import { MyBulb } from './MyBulb.js';




class MyDoor extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app 
     * @param {number} doorWidth the width of the door
     * @param {number} doorLength the length of the door
     * @param {number} doorDepth the depth of the door
     * @param {number} doorTexturePath path to the door texture
     * @param {number} knobTexturePath path to the knob texture
     * @param {number} diffuseDoorColor diffuse color, default is #EADDCA
     * @param {number} specularDoorColor specular color, default is #EADDCA
     * @param {number} doorShininess door chiniess, default is 10
     */
    constructor(app, doorWidth, doorLength, doorDepth, doorTexturePath,viewTexturePath, diffuseDoorColor, specularDoorColor, doorShininess) {
        super();
        this.app = app;
        this.type = 'Group';
        this.doorWidth = doorWidth
        this.doorLength = doorLength || 4
        this.doorDepth = doorDepth
        this.doorTexturePath = doorTexturePath
        this.viewTexturePath = viewTexturePath
        this.diffuseDoorColor = diffuseDoorColor || "#EADDCA"
        this.specularDoorColor = specularDoorColor || "#EADDCA"
        this.doorShininess = doorShininess || 10

        if(this.doorTexturePath){
            this.doorTexture = new THREE.TextureLoader().load(this.doorTexturePath);
            this.doorTexture.wrapS = THREE.RepeatWrapping;
            this.doorTexture.wrapT = THREE.RepeatWrapping;
        }

        if(this.viewTexturePath){
            this.viewTexture = new THREE.TextureLoader().load(this.viewTexturePath);
            this.viewTexture.wrapS = THREE.RepeatWrapping;
            this.viewTexture.wrapT = THREE.RepeatWrapping;
        }

        this.doorMaterial = new THREE.MeshPhysicalMaterial({map: this.doorTexture, metalness: 0.6, roughness: 0.4})
        this.planeMaterial = new THREE.MeshPhongMaterial({ color: "#000000", 
            specular: "#000000", emissive: "#000000", shininess: 10})

        let top = new THREE.BoxGeometry(this.doorLength,this.doorWidth * 0.15,this.doorDepth)
        let side = new THREE.BoxGeometry(this.doorLength*0.2,this.doorWidth * 0.2,this.doorDepth)
        let bottom = new THREE.BoxGeometry(this.doorLength,this.doorWidth * 0.65,this.doorDepth)
        let bar = new THREE.CylinderGeometry(this.doorDepth,this.doorDepth,this.doorWidth * 0.2)
        let view = new THREE.PlaneGeometry(this.doorLength,this.doorWidth)

        this.top = new THREE.Mesh(top,this.doorMaterial)


        this.leftSide = new THREE.Mesh(side,this.doorMaterial)
        this.leftSide.translateY(-this.doorWidth * 0.175)
        this.leftSide.translateX(0.4*this.doorLength)
        
        this.rightSide = new THREE.Mesh(side,this.doorMaterial)
        this.rightSide.translateY(-this.doorWidth * 0.175)
        this.rightSide.translateX(-0.4*this.doorLength)

        this.bottom = new THREE.Mesh(bottom,this.doorMaterial)
        this.bottom.translateY(-this.doorWidth * 0.65 / 2 - this.doorWidth * 0.275 )

        this.first = new THREE.Mesh(bar,this.doorMaterial)
        this.first.translateY(-this.doorWidth * 0.175)

        this.second = new THREE.Mesh(bar,this.doorMaterial)
        this.second.translateY(-this.doorWidth * 0.175)
        this.second.translateX(-this.doorLength/5)

        this.third = new THREE.Mesh(bar,this.doorMaterial)
        this.third.translateY(-this.doorWidth * 0.175)
        this.third.translateX(this.doorLength/5)

        this.plane = new THREE.Mesh(view,this.planeMaterial)
        this.plane.translateY(-this.doorWidth / 2)



        this.add(this.first,this.second,this.third)
        this.add(this.leftSide)
        this.add(this.rightSide)
        this.add(this.bottom)
        this.add(this.top)
        this.add(this.plane)

        this.translateY(-0.075*this.doorWidth)
        this.translateY(0.5*this.doorWidth)
    }
}

MyDoor.prototype.isGroup = true;

export { MyDoor };