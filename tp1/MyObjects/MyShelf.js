import * as THREE from 'three';
import { MyApp } from '../MyApp.js';




class MyShelf extends THREE.Object3D {

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
    constructor(app, shelfHeight, shelfDepth, shelfLength, shelfTexturePath, diffuseShelfColor, specularShelfColor, shelfShininess) {
        super();
        this.app = app;
        this.type = 'Group';
        this.shelfHeight = 1
        this.shelfLength = shelfLength || 4
        this.shelfDepth = 1
        this.shelfHeight = shelfHeight
        this.shelfDepth = shelfDepth
        this.shelfTexturePath = shelfTexturePath
        this.diffuseShelfColor = diffuseShelfColor || "#EADDCA"
        this.specularShelfColor = specularShelfColor || "#EADDCA"
        this.shelfShininess = shelfShininess || 10

        
        if(this.shelfTexturePath){
            this.shelfTexture = new THREE.TextureLoader().load(this.shelfTexturePath);
            this.shelfTexture.wrapS = THREE.RepeatWrapping;
            this.shelfTexture.wrapT = THREE.RepeatWrapping;
        }

        this.shelfMaterial = new THREE.MeshPhysicalMaterial({map: this.shelfTexture, metalness: 0.2, roughness: 0.3, side: THREE.DoubleSide })

        var materials = [
            this.shelfMaterial, // Right face
            this.shelfMaterial, // Left face
            this.shelfMaterial, // Top face
            this.shelfMaterial, // Bottom face
            new THREE.MeshBasicMaterial({
                transparent: true,
                opacity: 0
              }), 
            this.shelfMaterial  // Back face
            ];
         
        var cube = new THREE.BoxGeometry(this.shelfLength, this.shelfHeight * 0.33, this.shelfDepth);

        this.bottomCube = new THREE.Mesh(cube, materials)
        this.add(this.bottomCube)

        this.midCube = new THREE.Mesh(cube, materials)
        this.midCube.translateY(this.shelfHeight * 0.331)
        this.add(this.midCube)

        this.topCube = new THREE.Mesh(cube, materials)
        this.topCube.translateY(this.shelfHeight * 0.66)
        this.add(this.topCube)

        
        this.translateY(this.shelfHeight * 0.33 / 2 + 0.01)
    }
}

MyShelf.prototype.isGroup = true;

export { MyShelf };