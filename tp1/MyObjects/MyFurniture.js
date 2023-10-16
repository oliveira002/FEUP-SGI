import * as THREE from 'three';
import { MyApp } from '../MyApp.js';




class MyFurniture extends THREE.Object3D {

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
    constructor(app, furnitureHeight, furnitureDepth, furLength, furnitureTexturePath, diffuseFurnitureColor, specularFurnitureColor, furnitureShininess) {
        super();
        this.app = app;
        this.type = 'Group';
        this.furHeight = 1
        this.furLength = furLength || 4
        this.furDepth = 1
        this.furnitureHeight = furnitureHeight
        this.furnitureDepth = furnitureDepth
        this.furnitureTexturePath = furnitureTexturePath
        this.diffuseFurnitureColor = diffuseFurnitureColor || "#EADDCA"
        this.specularFurnitureColor = specularFurnitureColor || "#EADDCA"
        this.furnitureShininess = furnitureShininess || 10

        if(this.furnitureTexturePath){
            this.furnitureTexture = new THREE.TextureLoader().load(this.furnitureTexturePath);
            this.furnitureTexture.wrapS = THREE.RepeatWrapping;
            this.furnitureTexture.wrapT = THREE.RepeatWrapping;
            this.handleTexture = new THREE.TextureLoader().load("textures/handle.jpg");
            this.handleTexture.wrapS = THREE.RepeatWrapping;
            this.handleTexture.wrapT = THREE.RepeatWrapping;
        }

        this.furMaterial = new THREE.MeshPhongMaterial({ color: this.diffuseFurnitureColor, 
            specular: this.specularFurnitureColor, emissive: "#000000", shininess: this.furnitureShininess, map: this.furnitureTexture })

        this.handleMaterial = new THREE.MeshPhongMaterial({ color: this.diffuseFurnitureColor, 
            specular: this.specularFurnitureColor, emissive: "#000000", shininess: this.furnitureShininess, map: this.handleTexture })
        
        let top = new THREE.BoxGeometry(this.furLength, this.furHeight * 0.05, this.furDepth)
        let bot = new THREE.BoxGeometry(this.furLength, this.furHeight * 0.05, this.furDepth)
        let box = new THREE.BoxGeometry(this.furLength * 0.25, this.furHeight * 0.90, this.furDepth)
        let drawer = new THREE.BoxGeometry(this.furLength * 0.5, this.furHeight * 0.05, this.furDepth * 0.5)
        let inside = new THREE.BoxGeometry(this.furLength * 0.5, this.furHeight * 0.05, this.furDepth)
        let handle = new THREE.BoxGeometry(this.furLength * 0.02, this.furHeight * 0.1,this.furDepth * 0.2)

        this.topFur = new THREE.Mesh(top, this.furMaterial)
        this.topFur.translateY(this.furHeight * 0.95)
        this.add( this.topFur );

        this.botFur = new THREE.Mesh(bot, this.furMaterial)
        this.botFur.translateY(this.furHeight * 0.05 / 2)
        this.add( this.botFur );

        this.boxRightMesh = new THREE.Mesh(box, this.furMaterial)
        this.boxRightMesh.translateY(this.furHeight * 0.5)
        this.boxRightMesh.translateX(this.furLength * 0.375)
        this.add( this.boxRightMesh );

        this.boxLeftMesh = new THREE.Mesh(box, this.furMaterial)
        this.boxLeftMesh.translateY(this.furHeight * 0.5)
        this.boxLeftMesh.translateX(-this.furLength * 0.375)
        this.add( this.boxLeftMesh );

        this.frontDrawer = new THREE.Mesh(drawer, this.furMaterial)
        this.frontDrawer.translateZ(this.furHeight / 2 - this.furHeight  * 0.05 / 2)
        this.frontDrawer.translateY(this.furDepth / 4 + (this.furHeight * 0.05 / 2))
        this.frontDrawer.rotateX(Math.PI / 2)
        this.add(this.frontDrawer);

        this.insideDrawer = new THREE.Mesh(inside, this.furMaterial)
        this.insideDrawer.translateY(this.furHeight * 0.5)
        this.add( this.insideDrawer );

        this.handleMesh = new THREE.Mesh(handle,this.handleMaterial)
        this.handleMesh.rotateY(Math.PI / 2)
        this.handleMesh.translateX(- this.furDepth / 2 - this.furLength * 0.01)
        this.handleMesh.translateY(this.furHeight / 4)
        this.add(this.handleMesh)

        


        this.translateY(-this.furnitureHeight * 0.5)
        this.scale.set(1,this.furnitureHeight,this.furnitureDepth)
    }
}

MyFurniture.prototype.isGroup = true;

export { MyFurniture };