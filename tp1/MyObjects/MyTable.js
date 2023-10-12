import * as THREE from 'three';
import { MyApp } from '../MyApp.js';



class MyTable extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} tableWidth the width of the table in relation to the Z axis. Default `1`
     * @param {number} tableLength the length of the table in relation to the X axis. Default `1`
     * @param {number} tableHeight the height of the table in relation to the Y axis. Default `1`
     * @param {number} tableTopHeight the height of the table top in relation to the Y axis. Default `0.2`
     * @param {number} legRadius the radius of the table's legs. Default `tableWidth/10`
     * @param {string} tableTexturePath the path of the texture to be used on the table. Default `undefined`
     * @param {number} diffuseTableColor the diffuse component of the table's color. Default `#F0E5D8`
     * @param {number} specularTableColor the specular component of the table's color. Default `#FFFFFF`
     * @param {number} tableShininess the shininess component of the table's color. Default `100`
     */
    constructor(app, tableWidth, tableLength, tableHeight, tableTopHeight, legRadius, tableTexturePath, diffuseTableColor, specularTableColor, tableShininess) {
        super();
        this.app = app;
        this.type = 'Group';
        this.tableWidth = tableWidth || 1
        this.tableLength = tableLength || 1
        this.tableHeight = tableHeight || 1
        this.tableTopHeight = tableTopHeight || 0.2
        this.legRadius = legRadius || this.tableWidth/14
        this.legHeight = this.tableHeight - this.tableTopHeight
        this.tableTexturePath = tableTexturePath
        this.diffuseTableColor = diffuseTableColor || "#F0E5D8"
        this.specularTableColor = specularTableColor || "#FFFFFF"
        this.tableShininess = tableShininess || 100
        
        if(this.tableTexturePath){
            this.tableTexture = new THREE.TextureLoader().load(this.tableTexturePath);
            this.tableTexture.wrapS = THREE.RepeatWrapping;
            this.tableTexture.wrapT = THREE.RepeatWrapping;
        }

        this.tableMaterial = new THREE.MeshPhongMaterial({ color: this.diffuseTableColor, 
            specular: this.specularTableColor, emissive: "#000000", shininess: this.tableShininess, map: this.tableTexture })

        let tableTop = new THREE.BoxGeometry(this.tableLength, this.tableTopHeight, this.tableWidth)
        let leg = new THREE.CylinderGeometry(this.legRadius, this.legRadius, this.legHeight); 
        
        // table top
        this.tableTopMesh = new THREE.Mesh(tableTop, this.tableMaterial)
        this.tableTopMesh.position.x = 0
        this.tableTopMesh.position.y = this.tableHeight - this.tableTopHeight/2;
        this.tableTopMesh.position.z = 0
        this.add( this.tableTopMesh );

        // front left leg
        this.legFrontLeftMesh = new THREE.Mesh(leg, this.tableMaterial)
        this.legFrontLeftMesh.translateX(-(this.tableLength/2 - this.legRadius))
        this.legFrontLeftMesh.translateY(this.legHeight/2)
        this.legFrontLeftMesh.translateZ((this.tableWidth/2 - this.legRadius))
        this.add( this.legFrontLeftMesh );
        
        // front right leg
        this.legFrontRightMesh = new THREE.Mesh(leg, this.tableMaterial)
        this.legFrontRightMesh.translateX((this.tableLength/2 - this.legRadius))
        this.legFrontRightMesh.translateY(this.legHeight/2)
        this.legFrontRightMesh.translateZ((this.tableWidth/2 - this.legRadius))
        this.add( this.legFrontRightMesh );

        // back left leg
        this.legBackLeftMesh = new THREE.Mesh(leg, this.tableMaterial)
        this.legBackLeftMesh.translateX(-(this.tableLength/2 - this.legRadius))
        this.legBackLeftMesh.translateY(this.legHeight/2)
        this.legBackLeftMesh.translateZ(-(this.tableWidth/2 - this.legRadius))
        this.add( this.legBackLeftMesh );
        
        // back right leg
        this.legBackRightMesh = new THREE.Mesh(leg, this.tableMaterial)
        this.legBackRightMesh.translateX((this.tableLength/2 - this.legRadius))
        this.legBackRightMesh.translateY(this.legHeight/2)
        this.legBackRightMesh.translateZ(-(this.tableWidth/2 - this.legRadius))
        this.add( this.legBackRightMesh );

        this.translateY(-this.tableHeight/2);


    }
}

MyTable.prototype.isGroup = true;

export { MyTable };