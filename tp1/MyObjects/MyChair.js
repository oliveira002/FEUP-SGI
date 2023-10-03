import * as THREE from 'three';
import { MyApp } from '../MyApp.js';



class MyChair extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(app, chairWidth, chairLength, chairHeight, chairTopHeight, legRadius, diffuseChairColor, specularChairColor, chairShininess) {
        super();
        this.app = app;
        this.type = 'Group';
        this.chairWidth = chairWidth || 1
        this.chairLength = chairLength || 1
        this.chairHeight = chairHeight || 1
        this.chairTopHeight = chairTopHeight || 0.2
        this.legRadius = legRadius || this.chairWidth/10
        this.legHeight = this.chairHeight - this.chairTopHeight
        this.diffuseChairColor = diffuseChairColor || "#F0E5D8"
        this.specularChairColor = specularChairColor || "#777777"
        this.chairShininess = chairShininess || 10

        this.chairMaterial = new THREE.MeshPhongMaterial({ color: this.diffuseChairColor, 
            specular: this.specularChairColor, emissive: "#000000", shininess: this.chairShininess })

        let chairTop = new THREE.BoxGeometry(this.chairLength, this.chairTopHeight, this.chairWidth)
        let chairBack = new THREE.BoxGeometry(this.chairLength, this.chairTopHeight / 2.5, this.chairWidth * 2)
        let leg = new THREE.CylinderGeometry(this.legRadius, this.legRadius, this.legHeight); 
        
        // chair top
        this.chairTopMesh = new THREE.Mesh(chairTop, this.chairMaterial)
        this.chairTopMesh.position.x = 0
        this.chairTopMesh.position.y = this.chairHeight - this.chairTopHeight/2;
        this.chairTopMesh.position.z = 0
        this.add( this.chairTopMesh );

        // front left leg
        this.legFrontLeftMesh = new THREE.Mesh(leg, this.chairMaterial)
        this.legFrontLeftMesh.translateX(-(this.chairLength/2 - this.legRadius))
        this.legFrontLeftMesh.translateY(this.legHeight/2)
        this.legFrontLeftMesh.translateZ((this.chairWidth/2 - this.legRadius))
        this.add( this.legFrontLeftMesh );
        
        // front right leg
        this.legFrontRightMesh = new THREE.Mesh(leg, this.chairMaterial)
        this.legFrontRightMesh.translateX((this.chairLength/2 - this.legRadius))
        this.legFrontRightMesh.translateY(this.legHeight/2)
        this.legFrontRightMesh.translateZ((this.chairWidth/2 - this.legRadius))
        this.add( this.legFrontRightMesh );

        // back left leg
        this.legBackLeftMesh = new THREE.Mesh(leg, this.chairMaterial)
        this.legBackLeftMesh.translateX(-(this.chairLength/2 - this.legRadius))
        this.legBackLeftMesh.translateY(this.legHeight/2)
        this.legBackLeftMesh.translateZ(-(this.chairWidth/2 - this.legRadius))
        this.add( this.legBackLeftMesh );

        
        // back right leg
        this.legBackRightMesh = new THREE.Mesh(leg, this.chairMaterial)
        this.legBackRightMesh.translateX((this.chairLength/2 - this.legRadius))
        this.legBackRightMesh.translateY(this.legHeight/2)
        this.legBackRightMesh.translateZ(-(this.chairWidth/2 - this.legRadius))
        this.add( this.legBackRightMesh );
        

        // chair back
        this.backMesh = new THREE.Mesh(chairBack, this.chairMaterial)
        this.backMesh.position.y = this.chairHeight - this.chairTopHeight/2;
        this.backMesh.rotateX(Math.PI / 2)
        this.backMesh.translateZ(-this.chairWidth)
        this.backMesh.translateY(-this.chairLength /2)
        this.add( this.backMesh);

        this.translateY(-this.chairHeight/2);

        

    }
}

MyChair.prototype.isGroup = true;

export { MyChair };