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
     * @param {number} floor_length the measurement of the side of the floor parallel to the x axis to which the walls are relative to. Default is `1`
     * @param {number} floor_width the measurement of the side of the floor parallel to the z axis to which the walls are relative to. Default is `1`
     * @param {number} diffuseWallColor the diffuse component of the wall's color. Default `#fdfd96`
     * @param {number} specularWallColor the specular component of the wall's color. Default `#777777`
     * @param {number} wallShininess the shininess component of the wall's color. Default `30`
     */
    constructor(app, height, floor_length, floor_width, wallsTexturePath, diffuseWallColor, specularWallColor, wallShininess) {
        super();
        this.app = app;
        this.type = 'Group';
        this.height = height || 1
        this.floor_length = floor_length || 1;
        this.floor_width = floor_width || 1;
        this.wallsTexturePath = wallsTexturePath
        this.diffuseWallColor = diffuseWallColor || "#fdfd96"
        this.specularWallColor = specularWallColor || "#777777"
        this.wallShininess = wallShininess || 30

        if(this.wallsTexturePath){
            this.wallsTexture = new THREE.TextureLoader().load(wallsTexturePath);
            this.wallsTexture.wrapS = THREE.RepeatWrapping;
            this.wallsTexture.wrapT = THREE.RepeatWrapping;
            let wallsTextureRepeatU = 3;
            let wallsTextureRepeatV = 3;
            this.wallsTexture.repeat.set(wallsTextureRepeatU, wallsTextureRepeatV );

            /*let floorUVRate = this.floorSizeV / this.floorSizeU;

            let floorTextureUVRate = 620 / 620; // image dimensions
            this.floorTexture.rotation = 0;
            this.floorTexture.offset = new THREE.Vector2(0,0);*/
        }

        this.wallMaterial = new THREE.MeshPhongMaterial({ /*color: this.diffuseWallColor, 
            specular: this.specularWallColor, emissive: "#000000", shininess: this.wallShininess,*/ map: this.wallsTexture })

        let wallX = new THREE.PlaneGeometry(this.floor_length, this.height)
        let wallZ = new THREE.PlaneGeometry(this.floor_width, this.height)
        
        // back wall (looking from x= +inf to x= 0)
        this.backWallMesh = new THREE.Mesh(wallZ, this.wallMaterial)
        this.backWallMesh.translateX(-this.floor_length/2)
        this.backWallMesh.translateY(this.height/2)
        this.backWallMesh.rotateY(Math.PI/2)
        this.add( this.backWallMesh );
        
        // right wall
        this.rightWallMesh = new THREE.Mesh(wallX, this.wallMaterial)
        this.rightWallMesh.translateZ(-this.floor_width/2)
        this.rightWallMesh.translateY(this.height/2)
        this.add( this.rightWallMesh );

        //left wall
        this.leftWallMesh = new THREE.Mesh(wallX, this.wallMaterial)
        this.leftWallMesh.translateZ(this.floor_width/2)
        this.leftWallMesh.translateY(this.height/2)
        this.leftWallMesh.rotateY(Math.PI)
        this.add( this.leftWallMesh );

        //front wall
        this.frontWallMesh = new THREE.Mesh(wallZ, this.wallMaterial)
        this.frontWallMesh.translateX(this.floor_length/2)
        this.frontWallMesh.translateY(this.height/2)
        this.frontWallMesh.rotateY(-Math.PI/2)
        this.add( this.frontWallMesh );

        this.translateY(-this.height/2)
    }
}

MyWalls.prototype.isGroup = true;

export { MyWalls };