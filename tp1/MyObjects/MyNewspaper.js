import * as THREE from 'three';
import { MyApp } from '../MyApp.js';
import { MyNurbsBuilder } from '../MyBuilders/MyNurbsBuilder.js';

/**
 * This class contains the newspaper representation
 */
class MyNewspaper extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app 
     */
    constructor(app) {

        super();
        this.app = app;
        this.type = 'Group';

        this.meshes = []
        this.builder = new MyNurbsBuilder()
        this.front = null
        this.back = null
        this.newspaperTexturePath = "textures/newspaper.jpg"
        this.newspaperTexture = new THREE.TextureLoader().load(this.newspaperTexturePath);
        this.newspaperTexture.wrapS = THREE.RepeatWrapping;
        this.newspaperTexture.wrapT = THREE.RepeatWrapping;
        this.newspaperTexture.flipY = false
        this.newspaperTexture.rotation = Math.PI/2
        

        this.material = new THREE.MeshPhysicalMaterial({map: this.newspaperTexture, metalness: 0, roughness: 0.3, side: THREE.DoubleSide, thickness: 2 })
        this.samplesU = 200 
        this.samplesV = 200

        this.recompute()
    }

    initNewspaper(){
        let orderU = 1
        let orderV = 3

        let controlPoints = [
            [
                [0.8, 0.90227,0.83492, 1],
                [0.8, 0.91465,0.08193, 1],
                [0.8, 0.87998,0.0835, 1], 
                [0.8, 0.52393,0.05837, 1], 
            ],
            [
                [-0.8, 0.90227,0.83492, 1],
                [-0.8, 0.91465,0.08193, 1],
                [-0.8, 0.87998,0.0835, 1], 
                [-0.8, 0.52393,0.05837, 1], 
            ]
        ]

        //this.displayControlPoints(controlPoints)

        let surfaceData = this.builder.build(controlPoints, orderU, orderV, this.samplesU, this.samplesV, this.material)

        this.newspaper = new THREE.Mesh(surfaceData, this.material);
        //this.newspaper.translateY(5)
        //this.newspaper.rotateZ(Math.PI)
        this.add(this.newspaper)
        this.meshes.push(this.newspaper)
    }

    recompute() {

        if (this.meshes !== null) {

            for (let i = 0; i < this.meshes.length; i++) {
              this.app.scene.remove(this.meshes[i])
            }

            this.meshes = []

        }
        this.initNewspaper();
    }

    displayControlPoints(controlPoints) {
        let sphereGeometry = new THREE.SphereGeometry(0.07, 20, 20);

        let colorOffset = 0x00
        for (let i = 0; i < controlPoints.length; i++) {
            let row = controlPoints[i];
            let sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000+colorOffset });

            for (let j = 0; j < row.length; j++) {
                let point = row[j];
                let controlPoint = new THREE.Mesh(sphereGeometry, sphereMaterial);
                controlPoint.position.set(...point);
                this.add(controlPoint);
            }
            colorOffset += 0x00ffff/controlPoints.length
        }
    }
    
}

MyNewspaper.prototype.isGroup = true;

export { MyNewspaper };