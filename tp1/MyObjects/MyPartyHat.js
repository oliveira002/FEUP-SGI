import * as THREE from 'three';
import { MyApp } from '../MyApp.js';
import { MyPortrait } from './MyPortrait.js';
import { MyBulb } from './MyBulb.js';

/**
 * This class contains a party hat representation
 */
class MyPartyHat extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app 
     * @param {number} radius radius of the hat
     * @param {number} height height of the hat
     * @param {string} hatTexturePath path to the hat texture
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