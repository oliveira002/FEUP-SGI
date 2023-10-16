import * as THREE from 'three';
import { MyApp } from '../MyApp.js';



class MyPlate extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} maxRadius the radius of the top part of the plate. Default is `1`
     * @param {number} height the height of the plate. Default is `radius/5`
     * @param {number} diffusePlateColor the diffuse component of the plate's color. Default `#FFFFFF`
     * @param {number} specularPlateColor the specular component of the plate's color. Default `#FFFFFF`
     * @param {number} plateShininess the shininess component of the plate's color. Default `30` 
     */
    constructor(app, maxRadius, height, diffusePlateColor, specularPlateColor, plateShininess) {
        super();
        this.app = app;
        this.type = 'Group';
        this.radius = maxRadius || 1
        this.height = height || this.radius/5
        this.diffusePlateColor = diffusePlateColor || "#FFFFFF"
        this.specularPlateColor = specularPlateColor || "#FFFFFF"
        this.plateShininess = plateShininess || 30

        this.plateMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlateColor, 
            specular: this.specularPlateColor, emissive: "#000000", shininess: this.plateShininess })


        let plate = new THREE.CylinderGeometry( this.radius, this.radius * 0.5, this.height, 32 ); 
        
        // plateMesh
        this.plateMesh = new THREE.Mesh(plate, this.plateMaterial)
        this.add( this.plateMesh );
    }
}

MyPlate.prototype.isGroup = true;

export { MyPlate };