import * as THREE from 'three';
import { MyApp } from '../MyApp.js';

/**
 * This class contains walls representation for a square floor
 */
class MyWalls extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} height the height of the wall. Default is `1`
     * @param {number} floor_length the distance of each wall to the center of the room. Default is `1`
     * @param {number} diffuseWallColor the diffuse component of the wall's color. Default `#fdfd96`
     * @param {number} specularWallColor the specular component of the wall's color. Default `#777777`
     * @param {number} wallShininess the shininess component of the wall's color. Default `30`
     */
    constructor(app, height, floor_length, diffuseWallColor, specularWallColor, wallShininess) {
        super();
        this.app = app;
        this.type = 'Group';
        this.height = height || 1
        this.floor_length = floor_length || 1;
        this.diffuseWallColor = diffuseWallColor || "#fdfd96"
        this.specularWallColor = specularWallColor || "#777777"
        this.wallShininess = wallShininess || 30

        this.wallMaterial = new THREE.MeshPhongMaterial({ color: this.diffuseWallColor, 
            specular: this.specularWallColor, emissive: "#000000", shininess: this.wallShininess })

        let wall = new THREE.PlaneGeometry(this.floor_length, this.height)
        
        // back wall (looking from x= +inf to x= 0)
        this.backWallMesh = new THREE.Mesh(wall, this.wallMaterial)
        this.backWallMesh.translateX(-this.floor_length/2)
        this.backWallMesh.translateY(this.height/2)
        this.backWallMesh.rotateY(Math.PI/2)
        this.add( this.backWallMesh );
        
        // right wall
        this.rightWallMesh = new THREE.Mesh(wall, this.wallMaterial)
        this.rightWallMesh.translateZ(-this.floor_length/2)
        this.rightWallMesh.translateY(this.height/2)
        this.add( this.rightWallMesh );

        //left wall
        this.leftWallMesh = new THREE.Mesh(wall, this.wallMaterial)
        this.leftWallMesh.translateZ(this.floor_length/2)
        this.leftWallMesh.translateY(this.height/2)
        this.leftWallMesh.rotateY(Math.PI)
        this.add( this.leftWallMesh );

        //front wall
        this.frontWallMesh = new THREE.Mesh(wall, this.wallMaterial)
        this.frontWallMesh.translateX(this.floor_length/2)
        this.frontWallMesh.translateY(this.height/2)
        this.frontWallMesh.rotateY(-Math.PI/2)
        this.add( this.frontWallMesh );
    }
}

MyWalls.prototype.isGroup = true;

export { MyWalls };