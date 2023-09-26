import * as THREE from 'three';
import { MyApp } from '../MyApp.js';



class MyPlate extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} height the height of the wall
     * @param {number} floor_length the distance of each wall to the center of the room 
     * @param {number} color the hexadecimal representation of the walls' color
     */
    constructor(app, radius, height, diffusePlateColor, specularPlateColor, plateShininess) {
        super();
        this.app = app;
        this.type = 'Group';
        this.radius = radius || 1
        this.height = height || 1
        this.diffusePlateColor = diffusePlateColor || "#FFFFFF"
        this.specularPlateColor = specularPlateColor || "#FFFFFF"
        this.plateShininess = plateShininess || 30

        this.plateMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlateColor, 
            specular: this.specularPlateColor, emissive: "#000000", shininess: this.plateShininess })


        let plate = new THREE.CylinderGeometry( radius, radius * 0.7, this.radius * 0.3, 32 ); 
        
        // tableMesh
        this.plateMesh = new THREE.Mesh(plate, this.plateMaterial)
        this.plateMesh.position.x = 0
        this.plateMesh.position.y = 1
        this.plateMesh.position.z = 0
        this.add( this.plateMesh );

    }
}

MyPlate.prototype.isGroup = true;

export { MyPlate };