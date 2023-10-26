import * as THREE from 'three';
import { MyApp } from '../MyApp.js';

/**
 * This class contains a cake representation
 */
class MyCake extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} radius the radius of the cake. Default is `0.8`
     * @param {number} height the height of the cake. Default is `radius/2`
     * @param {number} sliceSize the size (radians) of the missing slice. Default is `PI/4`
     * @param {number} slicePosition the radial rotation (radians) of the missing slice, around the Y axis. Default is `0`
     * @param {string} cakeInsideTexturePath the path of the texture to be used inside the cake. Default `undefined`
     * @param {string} cakeOutsideTexturePath the path of the texture to be used outside the portrait. Default `undefined`
     * @param {number} diffuseCakeColor the diffuse component of the cake's color. Default `#eb8a52`
     * @param {number} specularCakeColor the specular component of the cake's color. Default `#777777`
     * @param {number} cakeShininess the shininess component of the cake's color. Default `30` 
     */
    constructor(app, radius, height, sliceSize, slicePosition, cakeInsideTexturePath, cakeOutsideTexturePath, diffuseCakeColor, specularCakeColor, cakeShininess) {
        super();
        this.app = app;
        this.type = 'Group';
        this.radius = radius || 0.8
        this.height = height || this.radius/2
        this.sliceSize = sliceSize || Math.PI/4
        this.cakeInsideTexturePath = cakeInsideTexturePath
        this.cakeOutsideTexturePath = cakeOutsideTexturePath
        this.slicePosition = slicePosition || Math.PI
        this.diffuseCakeColor = diffuseCakeColor || "#eb8a52"
        this.specularCakeColor = specularCakeColor || "#777777"
        this.cakeShininess = cakeShininess || 30

        if(this.cakeOutsideTexturePath){
            this.cakeOutsideTexture = new THREE.TextureLoader().load(this.cakeOutsideTexturePath);
            this.cakeOutsideTexture.wrapS = THREE.RepeatWrapping;
            this.cakeOutsideTexture.wrapT = THREE.RepeatWrapping;
        }

        if(this.cakeInsideTexturePath){
            this.cakeInsideTexture1 = new THREE.TextureLoader().load(this.cakeInsideTexturePath);
            this.cakeInsideTexture1.wrapS = THREE.RepeatWrapping;
            this.cakeInsideTexture1.wrapT = THREE.RepeatWrapping;

            this.cakeInsideTexture2 = new THREE.TextureLoader().load(this.cakeInsideTexturePath);
            this.cakeInsideTexture2.wrapS = THREE.RepeatWrapping;
            this.cakeInsideTexture2.wrapT = THREE.RepeatWrapping;
            this.cakeInsideTexture2.rotation = Math.PI
        }

        this.cakeOutsideMaterial = new THREE.MeshPhongMaterial({ /*color: this.diffuseCakeColor, 
            specular: this.specularCakeColor, emissive: "#000000", shininess: this.cakeShininess,*/ map: this.cakeOutsideTexture, bumpMap: this.cakeOutsideTexture, bumpScale: 0.05})

        this.cakeInsideMaterialLeft = new THREE.MeshPhongMaterial({ /*color: this.diffuseCakeColor, 
            specular: this.specularCakeColor, emissive: "#000000", shininess: this.cakeShininess,*/ map: this.cakeInsideTexture2})

        this.cakeInsideMaterialRight = new THREE.MeshPhongMaterial({ /*color: this.diffuseCakeColor, 
            specular: this.specularCakeColor, emissive: "#000000", shininess: this.cakeShininess,*/ map: this.cakeInsideTexture1})

        let cake = new THREE.CylinderGeometry(this.radius, this.radius, this.height, 32, 1, false, this.slicePosition, (2*Math.PI - this.sliceSize))
        let cake_inside = new THREE.PlaneGeometry(this.radius, this.height)
        
        // cake
        this.cakeMesh = new THREE.Mesh(cake, this.cakeOutsideMaterial)
        this.add( this.cakeMesh );

        // left inside part
        this.leftInsideMesh = new THREE.Mesh(cake_inside, this.cakeInsideMaterialLeft)
        this.leftInsideMesh.rotateY(this.sliceSize+this.slicePosition)
        this.leftInsideMesh.translateX(-this.radius/2)
        this.add( this.leftInsideMesh )

        // right inside part
        this.rightInsideMesh = new THREE.Mesh(cake_inside, this.cakeInsideMaterialRight)
        this.rightInsideMesh.rotateY(-(Math.PI/2 + this.slicePosition))
        this.rightInsideMesh.translateX(this.radius/2)
        this.add( this.rightInsideMesh ) 



        this.children.forEach(element => {
            element.castShadow = true
            //element.receiveShadow = true
        });
        
    }
}

MyCake.prototype.isGroup = true;

export { MyCake };