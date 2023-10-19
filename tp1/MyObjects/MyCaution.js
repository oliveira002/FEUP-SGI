import * as THREE from 'three';
import { MyApp } from '../MyApp.js';
import { MyPortrait } from './MyPortrait.js';
import { MyBulb } from './MyBulb.js';




class MyCaution extends THREE.Object3D {

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
    constructor(app, width, depth, height, cautionTexturePath) {
        super();
        this.app = app;
        this.type = 'Group';
        this.width = width
        this.depth = depth || 4
        this.height = height
        this.cautionTexturePath = "textures/caution.jpg"

        this.cautionTexture = new THREE.TextureLoader().load("textures/caution.jpg");

        this.material = new THREE.MeshPhongMaterial({ color: "#fcba03", 
            specular: "#acba03", map: this.cautionTexture})
        
        this.materialNormal = new THREE.MeshPhongMaterial({ color: "#fcba03", 
            specular: "#acba03"})
        

        var materials = [
            this.materialNormal, // Right face
            this.materialNormal, // Left face
            this.material, // Top face
            this.materialNormal, // Bottom face
            this.materialNormal,
            this.materialNormal  // Back face
            ];

        let piece = new THREE.BoxGeometry(this.width, this.depth, this.height)

        this.first = new THREE.Mesh(piece, materials)
        this.first.translateZ(this.depth)
        this.first.translateY(Math.sin(Math.PI / 3) * (this.height / 2) )
        this.first.rotateX(Math.PI / 3)

        this.snd = new THREE.Mesh(piece, materials)
        this.snd.translateY(Math.sin(Math.PI / 3) * (this.height / 2))
        this.snd.translateZ(-Math.cos(Math.PI / 3) * (this.height / 2) - this.depth)
        this.snd.rotateX(-Math.PI / 3)
        this.snd.rotateX(Math.PI)
        this.snd.rotateZ(Math.PI)
        //this.snd.translateY(Math.cos(Math.PI / 3) * (this.height / 2))))

        this.add(this.snd)
        this.add(this.first)

        this.translateZ(Math.cos(Math.PI / 3) * (this.height / 2) - this.depth)
        this.translateY(-Math.sin(Math.PI /3) * (this.height / 2))

        this.children.forEach(element => {
            element.castShadow = true
            element.receiveShadow = true
        });
    }
}

MyCaution.prototype.isGroup = true;

export { MyCaution };