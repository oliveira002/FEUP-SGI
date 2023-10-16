import * as THREE from 'three';
import { MyApp } from '../MyApp.js';
import { MyNurbsBuilder } from '../MyBuilders/MyNurbsBuilder.js';

/**
 * This class contains the vase representation
 */
class MyVase extends THREE.Object3D {

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
        this.vaseTexturePath = ""

        this.material = new THREE.MeshPhysicalMaterial({
            color:0xCCCCCC, 
            side: THREE.DoubleSide, 
            metalness: 0,  
            roughness: 0.1, 
            transmission: 1,
            thickness: 0.1, 
            reflectivity: 0.5,
        });
        this.samplesU = 200 
        this.samplesV = 200

        this.recompute()
    }

    initVase(){
        let orderU = 6 // len(controlPoints) - 1
        let orderV = 3 // len(controlPoints[0]) - 1

        let controlPoints = [   
            // U = 0
            [ 
                // V = 0..6
                [ 0, 0, 0, 1 ], //start
                [ 0, 0, 0, 1], //cp1
                [ -0, 0, 0, 1], //cp2
                [ -0, 0, 0, 1 ], //middle
                //[ -1.6, 0, -1.6*(2/3), 1], //cp3
                //[ 1.6, 0, -1.6*(2/3), 1], // cp4
                //[ 1.6, 0, 0, 1 ], // final
            ],
            // U = 1
            [ 
                // V = 0..6
                [ 0.8, 0, 0, 1 ], //start
                [ 0.8, 0, 0.8*4/3, 1], //cp1
                [ -0.8, 0, 0.8*4/3, 1], //cp2
                [ -0.8, 0, 0, 1 ], //middle
                //[ -1.6, 0, -1.6*(2/3), 1], //cp3
                //[ 1.6, 0, -1.6*(2/3), 1], // cp4
                //[ 1.6, 0, 0, 1 ], // final
            ],
            // U = 1
            [ 
                // V = 0..6
                [ 0.885, 0.1, 0, 1 ],
                [ 0.885, 0.1, 0.885*4/3, 1],
                [ -0.885, 0.1, 0.885*4/3, 1],
                [ -0.885, 0.1, 0, 1 ],
                //[ -1.77, 0.2, -1.77*(2/3), 1],
                //[ 1.77, 0.2, -1.77*(2/3), 1],
                //[ 1.77, 0.2, 0, 1 ],
            ],
            // U = 2
            [ 
                // V = 0..6
                [ 1.525, 0.85, 0, 1 ],
                [ 1.525, 0.85, 1.525*4/3, 1],
                [ -1.525, 0.85, 1.525*4/3, 1],
                [ -1.525, 0.85, 0, 1 ],
                //[ -3.05, 1.7, -3.05*(2/3), 1],
                //[ 3.05, 1.7, -3.05*(2/3), 1],
                //[ 3.05, 1.7, 0, 1 ],
            ],
            // U = 3
            [ 
                // V = 0..6
                [ 1.06, 1.7, 0, 1 ],
                [ 1.06, 1.7, 1.06*4/3, 1],
                [ -1.06, 1.7, 1.06*4/3, 1],
                [ -1.06, 1.7, 0, 1 ],
                //[ -2.12, 3.4, -2.12*(2/3), 1],
                //[ 2.12, 3.4, -2.12*(2/3), 1],
                //[ 2.12, 3.4, 0, 1 ],
            ],
            // U = 4
            [ 
                // V = 0..6
                [ 0.865, 1.95, 0, 1 ],
                [ 0.865, 1.95, 0.865*4/3, 1],
                [ -0.865, 1.95, 0.865*4/3, 1],
                [ -0.865, 1.95, 0, 1 ],
                //[ -1.73, 3.9, -1.73*(2/3), 1],
                //[ 1.73, 3.9, -1.73*(2/3), 1],
                //[ 1.73, 3.9, 0, 1 ],
            ],
            // U = 5
            [ 
                // V = 0..6
                [ 1.05, 2.25, 0, 1 ],
                [ 1.05, 2.25, 1.05*4/3, 1],
                [ -1.05, 2.25, 1.05*4/3, 1],
                [ -1.05, 2.25, 0, 1 ],
                //[ -2.1, 4.5, -2.1*(2/3), 1],
                //[ 2.1, 4.5, -2.1*(2/3), 1],
                //[ 2.1, 4.5, 0, 1 ],
            ]       
        ]

        //this.displayControlPoints(controlPoints)

        let surfaceData = this.builder.build(controlPoints, orderU, orderV, this.samplesU, this.samplesV, this.material)

        this.front = new THREE.Mesh(surfaceData, this.material);
        this.add(this.front)
        this.meshes.push(this.front)

        this.back = new THREE.Mesh(surfaceData, this.material);
        this.back.rotateY(Math.PI)
        this.add(this.back)
        this.meshes.push(this.back)

        this.scale.set(0.4, 0.4, 0.4)
    }

    recompute() {

        if (this.meshes !== null) {

            for (let i = 0; i < this.meshes.length; i++) {
              this.app.scene.remove(this.meshes[i])
            }

            this.meshes = []

        }
        this.initVase();
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

MyVase.prototype.isGroup = true;

export { MyVase };