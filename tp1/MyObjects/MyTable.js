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

        const radius = 0.05;
        let leg = new THREE.CylinderGeometry( radius, radius, this.height - this.length, 32 ); 
        
        // tableMesh
        this.tableMesh = new THREE.Mesh(table, this.tableMaterial)
        this.tableMesh.position.x = 0
        this.tableMesh.position.y = this.height - this.length/2
        this.tableMesh.position.z = 0
        this.add( this.tableMesh );

        // 1st front left leg
        this.legFrontLeftMesh = new THREE.Mesh(leg, this.tableMaterial)
        this.legFrontLeftMesh.translateX(-this.width/2 + radius)
        this.legFrontLeftMesh.translateY((this.height - this.length) / 2)
        this.legFrontLeftMesh.translateZ(this.depth/2 - radius)
        this.add( this.legFrontLeftMesh );


        // 2nd front right leg
        this.legFrontRightMesh = new THREE.Mesh(leg, this.tableMaterial)
        this.legFrontRightMesh.translateX(-this.width/2 + radius)
        this.legFrontRightMesh.translateY((this.height - this.length) / 2)
        this.legFrontRightMesh.translateZ(-this.depth/2 + radius)
        this.add( this.legFrontRightMesh );

        // 2nd back right leg
        this.legBackRightMesh = new THREE.Mesh(leg, this.tableMaterial)
        this.legBackRightMesh.translateX(this.width/2 - radius)
        this.legBackRightMesh.translateY((this.height - this.length) / 2)
        this.legBackRightMesh.translateZ(-this.depth/2 + radius)
        this.add( this.legBackRightMesh );

        // 2nd back left leg
        this.legBackLeftMesh = new THREE.Mesh(leg, this.tableMaterial)
        this.legBackLeftMesh.translateX(this.width/2 - radius)
        this.legBackLeftMesh.translateY((this.height - this.length) / 2)
        this.legBackLeftMesh.translateZ(this.depth/2 - radius)
        this.add( this.legBackLeftMesh );
    }
}

MyTable.prototype.isGroup = true;

export { MyTable };