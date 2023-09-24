import * as THREE from 'three';
import { MyApp } from '../MyApp.js';



class MyTable extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} height the height of the wall
     * @param {number} floor_length the distance of each wall to the center of the room 
     * @param {number} color the hexadecimal representation of the walls' color
     */
    constructor(app, width, length, height, depth, diffuseTableColor, specularTableColor, tableShininess) {
        super();
        this.app = app;
        this.type = 'Group';
        this.width = width || 1
        this.height = height || 1
        this.length = length || 1
        this.depth = depth || 1
        this.diffuseTableColor = diffuseTableColor || "#c4a484"
        this.specularTableColor = specularTableColor || "#777777"
        this.tableShininess = tableShininess || 30

        this.tableMaterial = new THREE.MeshPhongMaterial({ color: this.diffuseTableColor, 
            specular: this.specularTableColor, emissive: "#000000", shininess: this.tableShininess })

        let table = new THREE.BoxGeometry(this.width,this.length,this.depth)
        let leg = new THREE.CylinderGeometry( 0.1, 0.1, this.height - this.length, 32 ); 
        
        // tableMesh
        this.tableMesh = new THREE.Mesh(table, this.tableMaterial)
        this.tableMesh.position.x = 0
        this.tableMesh.position.y = this.height - this.length/2
        this.tableMesh.position.z = 0
        this.add( this.tableMesh );

        // 1st front leg
        this.legFrontLeftMesh = new THREE.Mesh(leg, this.tableMaterial)
        this.legFrontLeftMesh.translateX(0)
        this.legFrontLeftMesh.translateY((this.height - this.length) / 2)
        this.legFrontLeftMesh.translateZ(0) 
        this.add( this.legFrontLeftMesh );
    }
}

MyTable.prototype.isGroup = true;

export { MyTable };