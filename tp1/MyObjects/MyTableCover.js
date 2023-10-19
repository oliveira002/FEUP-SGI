import * as THREE from 'three';
import { MyApp } from '../MyApp.js';
import { MyPortrait } from './MyPortrait.js';
import { MyBulb } from './MyBulb.js';


class MyTableCover extends THREE.Object3D {

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
    constructor(app, width, depth, height, coverTexturePath) {
        super();
        this.app = app;
        this.type = 'Group';
        this.width = width
        this.depth = depth || 4
        this.height = height
        this.newDepth = this.depth / 18
        this.newWidth = this.width / 10
        this.coverTexturePath = coverTexturePath

        if(this.coverTexturePath) {
            this.coverTexture = new THREE.TextureLoader().load(this.coverTexturePath);
            this.coverTexture.wrapS = THREE.RepeatWrapping;
            this.coverTexture.wrapT = THREE.RepeatWrapping;
        }

        this.materialNormal = new THREE.MeshPhongMaterial({ 
            specular: "#ffffff", map: this.coverTexture})
    

        let top = new THREE.BoxGeometry(this.width, this.newDepth, this.height)

        let side = new THREE.BoxGeometry(this.newWidth, this.newDepth, this.height)

        let front = new THREE.BoxGeometry(this.newDepth, this.width + this.newDepth * 2, this.newWidth)


        this.topMesh = new THREE.Mesh(top, this.materialNormal)

        this.rightMesh = new THREE.Mesh(side,this.materialNormal)
        this.rightMesh.translateY(-this.newWidth / 2 + this.newDepth / 2)
        this.rightMesh.translateX(-this.width/2 - this.newDepth / 2)
        this.rightMesh.rotateZ(Math.PI / 2)

        this.leftMesh = new THREE.Mesh(side,this.materialNormal)
        this.leftMesh.translateY(-this.newWidth / 2 + this.newDepth / 2)
        this.leftMesh.translateX(this.width/2 + this.newDepth / 2)
        this.leftMesh.rotateZ(Math.PI / 2)

        this.frontMesh = new THREE.Mesh(front,this.materialNormal)
        this.frontMesh.translateZ(this.height / 2 + this.newDepth / 2)
        this.frontMesh.translateY(-this.newWidth / 2 + this.newDepth / 2)
        this.frontMesh.rotateX(Math.PI / 2)
        this.frontMesh.rotateZ(Math.PI / 2)

        this.backMesh = new THREE.Mesh(front,this.materialNormal)
        this.backMesh.translateZ(-this.height / 2 - this.newDepth / 2)
        this.backMesh.translateY(-this.newWidth / 2 + this.newDepth / 2)
        this.backMesh.rotateX(Math.PI / 2)
        this.backMesh.rotateZ(Math.PI / 2)


        this.add(this.leftMesh,this.rightMesh)
        this.add(this.frontMesh, this.backMesh)
        this.add(this.topMesh)

        this.children.forEach(element => {
            //element.castShadow = true
            element.receiveShadow = true
        });
    }
}

MyTableCover.prototype.isGroup = true;

export { MyTableCover };