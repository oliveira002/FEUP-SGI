import * as THREE from 'three';
import { MyApp } from '../MyApp.js';



class MyFlower extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} maxRadius the radius of the top part of the plate. Default is `1`
     * @param {number} height the height of the plate. Default is `radius/5`
     * @param {number} diffusePlateColor the diffuse component of the plate's color. Default `#FFFFFF`
     * @param {number} specularPlateColor the specular component of the plate's color. Default `#FFFFFF`
     * @param {number} plateShininess the shininess component of the plate's color. Default `30` 
     */
    constructor(app) {
        super();
        this.app = app;
        this.type = 'Group';

        this.shelfMaterial = new THREE.MeshPhongMaterial({ color: "#FFFFFF", 
            specular: "#FFFFFF", emissive: "#FFFFFF", shininess: 22, side: THREE.DoubleSide })

            var materials = [
                this.shelfMaterial,
                this.shelfMaterial,
                this.shelfMaterial,
                this.shelfMaterial,
                this.shelfMaterial,
                this.shelfMaterial,
                this.shelfMaterial, // Right face
                this.shelfMaterial, // Left face
                this.shelfMaterial, // Top face
                this.shelfMaterial, // Bottom face
                this.shelfMaterial  // Back face
                ];
        const geometry = new THREE.DodecahedronGeometry(1); 
        const material = new THREE.MeshBasicMaterial( { color: 0xffff00, side: THREE.DoubleSide } );



        this.petals = new THREE.Mesh( geometry, materials );
        this.add( this.petals );
    }
}

MyFlower.prototype.isGroup = true;

export { MyFlower };