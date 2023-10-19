import * as THREE from 'three';
import { MyApp } from '../MyApp.js';
import { MyPortrait } from './MyPortrait.js';
import { MyBulb } from './MyBulb.js';


class MyPartyHat extends THREE.Object3D {

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
    constructor(app, radius, height, hatTexturePath) {
        super();
        this.app = app;
        this.type = 'Group';
        this.radius = radius
        this.height = height || 4
        this.hatTexturePath = hatTexturePath

        if(this.hatTexturePath) {
            this.hatTexture = new THREE.TextureLoader().load(this.hatTexturePath);
            this.hatTexture.wrapS = THREE.RepeatWrapping;
            this.hatTexture.wrapT = THREE.RepeatWrapping;
        }

        this.materialNormal = new THREE.MeshPhongMaterial({ 
            specular: "#ffffff", map: this.hatTexture})
    

        let cone = new THREE.ConeGeometry(this.radius,this.height,200, 200)

        this.coneMesh = new THREE.Mesh(cone, this.materialNormal)

        this.add(this.coneMesh)

        this.children.forEach(element => {
            element.castShadow = true
            //element.receiveShadow = true
        });
    }
}

MyPartyHat.prototype.isGroup = true;

export { MyPartyHat };