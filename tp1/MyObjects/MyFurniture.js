import * as THREE from 'three';
import { MyApp } from '../MyApp.js';




class MyFurniture extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {boolean} isTurnedOn whether the light bulb inside the lamp is turned on or not. Default `false`
     * @param {number} pieceRadius the radius of the top and bottom lamp supports. Default is `0.1`
     * @param {number} lampHeight the total height of the lamp. Default is `2`
     * @param {number} diffuseLampColor the diffuse component of the lamp's color. Default `#F0E5D8`
     * @param {number} specularLampColor the specular component of the lamps's color. Default `#777777`
     * @param {number} lampShininess the shininess component of the lamp's color. Default `10`
     */
    constructor(app, furnitureHeight, furnitureDepth, furLength, diffuseFurnitureColor, specularFurnitureColor, furnitureShininess) {
        super();
        this.app = app;
        this.type = 'Group';
        this.furHeight = 1
        this.furLength = furLength || 4
        this.furDepth = 1
        this.furnitureHeight = furnitureHeight
        this.furnitureDepth = furnitureDepth
        this.diffuseFurnitureColor = diffuseFurnitureColor || "#F0E5D8"
        this.specularFurnitureColor = specularFurnitureColor || "#777777"
        this.furnitureShininess = furnitureShininess || 10

        this.furMaterial = new THREE.MeshPhongMaterial({ color: this.diffuseFurnitureColor, 
            specular: this.specularFurnitureColor, emissive: "#000000", shininess: this.furnitureShininess })
        
            
        this.furMaterial2 = new THREE.MeshPhongMaterial({ color: "#EADDCA", 
            specular: "#EADDCA", emissive: "#000000", shininess: this.furnitureShininess })

        this.furMaterial3 = new THREE.MeshPhongMaterial({ color: "#EADDCA", 
        specular: "#EADDCA", emissive: "#000000", shininess: this.furnitureShininess })
        
        
        
        let top = new THREE.BoxGeometry(this.furLength, this.furHeight * 0.05, this.furDepth)
        let bot = new THREE.BoxGeometry(this.furLength, this.furHeight * 0.05, this.furDepth)
        let left = new THREE.BoxGeometry(this.furHeight  * 0.05, this.furHeight, this.furDepth)
        let right = new THREE.BoxGeometry(this.furHeight  * 0.05, this.furHeight, this.furDepth)
        let back = new THREE.BoxGeometry(this.furLength , this.furHeight * 0.05, this.furDepth)
        let frontLeft = new THREE.BoxGeometry(this.furLength * 0.25, this.furHeight * 0.05, this.furDepth)
        let frontRight = new THREE.BoxGeometry(this.furLength * 0.25, this.furHeight * 0.05, this.furDepth)
        let drawer = new THREE.BoxGeometry(this.furLength * 0.5, this.furHeight * 0.05, this.furDepth * 0.5)
        let inside = new THREE.BoxGeometry(this.furLength * 0.5, this.furHeight * 0.05, this.furDepth)
        let insideSide = new THREE.BoxGeometry(this.furHeight  * 0.05, this.furHeight, this.furDepth)

        this.topFur = new THREE.Mesh(top, this.furMaterial)
        this.topFur.translateY(this.furHeight)
        this.add( this.topFur );

        this.botFur = new THREE.Mesh(bot, this.furMaterial)
        this.botFur.translateY(this.furHeight * 0.05 / 2)
        this.add( this.botFur );

        this.leftFur = new THREE.Mesh(left, this.furMaterial)
        this.leftFur.rotateX(Math.PI / 2)
        this.leftFur.translateZ(-this.furHeight / 2)
        this.leftFur.translateX(-this.furLength / 2 + this.furHeight * 0.025)
        this.add( this.leftFur );

        this.rightFur = new THREE.Mesh(right, this.furMaterial)
        this.rightFur.rotateX(Math.PI / 2)
        this.rightFur.translateZ(-this.furHeight / 2)
        this.rightFur.translateX(this.furLength / 2 - this.furHeight * 0.025)
        this.add( this.rightFur );

        
        this.backFur = new THREE.Mesh(back, this.furMaterial2)
        this.backFur.translateZ(-this.furHeight / 2 + this.furHeight  * 0.05 / 2)
        this.backFur.translateY(this.furDepth / 2)
        this.backFur.rotateX(Math.PI / 2)
        this.add( this.backFur );
        
        this.frontLeftFur = new THREE.Mesh(frontLeft, this.furMaterial2)
        this.frontLeftFur.translateZ(this.furHeight / 2 - this.furHeight  * 0.05 / 2)
        this.frontLeftFur.translateY(this.furDepth / 2)
        this.frontLeftFur.translateX(-this.furLength / 2 + 0.125 * this.furLength)
        this.frontLeftFur.rotateX(Math.PI / 2)
        this.add(this.frontLeftFur);

        this.frontRightFur = new THREE.Mesh(frontRight, this.furMaterial2)
        this.frontRightFur.translateZ(this.furHeight / 2 - this.furHeight  * 0.05 / 2)
        this.frontRightFur.translateY(this.furDepth / 2)
        this.frontRightFur.translateX(this.furLength / 2 - 0.125 * this.furLength)
        this.frontRightFur.rotateX(Math.PI / 2)
        this.add(this.frontRightFur);

        this.frontDrawer = new THREE.Mesh(drawer, this.furMaterial2)
        this.frontDrawer.translateZ(this.furHeight / 2 - this.furHeight  * 0.05 / 2)
        this.frontDrawer.translateY(this.furDepth / 4)
        this.frontDrawer.rotateX(Math.PI / 2)
        this.add(this.frontDrawer);

        this.insideDrawer = new THREE.Mesh(inside, this.furMaterial2)
        this.insideDrawer.translateY(this.furHeight * 0.5)
        this.add( this.insideDrawer );

        this.insideLeft = new THREE.Mesh(insideSide, this.furMaterial)
        this.insideLeft.translateY(this.furHeight / 2)
        this.insideLeft.translateX(this.furLength / 4)
        this.insideLeft.rotateX(Math.PI / 2)
        this.add( this.insideLeft );

        this.insideRight = new THREE.Mesh(insideSide, this.furMaterial)
        this.insideRight.translateY(this.furHeight / 2)
        this.insideRight.translateX(-this.furLength / 4)
        this.insideRight.rotateX(Math.PI / 2)
        this.add( this.insideRight );
        
        this.translateY(-this.furnitureHeight * 0.5)
        this.scale.set(1,this.furnitureHeight,this.furnitureDepth)
    }
}

MyFurniture.prototype.isGroup = true;

export { MyFurniture };