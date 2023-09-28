import * as THREE from 'three';
import { MyApp } from '../MyApp.js';

/**
 * This class contains walls representation for a square floor
 */
class MyCake extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} radius the radius of the cake. Default is `0.8`
     * @param {number} height the height of the plate. Default is `radius/2`
     * @param {number} sliceSize the size (radians) of the missing slice. Default is `PI/4`
     * @param {number} diffuseCakeColor the diffuse component of the cake's color. Default `#eb8a52`
     * @param {number} specularCakeColor the specular component of the cake's color. Default `#777777`
     * @param {number} cakeShininess the shininess component of the cake's color. Default `30` 
     */
    constructor(app, radius, height, sliceSize, diffuseCakeColor, specularCakeColor, cakeShininess) {
        super();
        this.app = app;
        this.type = 'Group';
        this.radius = radius || 0.8
        this.height = height || this.radius/2
        this.sliceSize = sliceSize || Math.PI/4
        this.diffuseCakeColor = diffuseCakeColor || "#eb8a52"
        this.specularCakeColor = specularCakeColor || "#777777"
        this.cakeShininess = cakeShininess || 30

        this.cakeMaterial = new THREE.MeshPhongMaterial({ color: this.diffuseCakeColor, 
            specular: this.specularCakeColor, emissive: "#000000", shininess: this.cakeShininess })

        let cake = new THREE.CylinderGeometry(this.radius, this.radius, this.height, 32, 1, false, 0, (2*Math.PI - this.sliceSize))
        let cake_inside = new THREE.PlaneGeometry(this.radius, this.height)
        
        // cake
        this.cakeMesh = new THREE.Mesh(cake, this.cakeMaterial)
        this.add( this.cakeMesh );

        // left inside part
        this.leftInsideMesh = new THREE.Mesh(cake_inside, this.cakeMaterial)
        this.leftInsideMesh.rotateY(this.sliceSize)
        this.leftInsideMesh.translateX(-this.radius/2)
        this.add( this.leftInsideMesh )

        // right inside part
        this.rightInsideMesh = new THREE.Mesh(cake_inside, this.cakeMaterial)
        this.rightInsideMesh.rotateY(-Math.PI/2)
        this.rightInsideMesh.translateX(this.radius/2)
        this.add( this.rightInsideMesh )
        
    }
}

MyCake.prototype.isGroup = true;

export { MyCake };