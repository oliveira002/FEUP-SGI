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
        this.bottom = null
        this.top = null
        this.vaseTexturePath = ""
        this.material = new THREE.MeshLambertMaterial({color:0xcc7357, side: THREE.DoubleSide, transparent: true});
        this.samplesU = 16 
        this.samplesV = 3

        this.recompute()
    }

    initVaseBottom(){
        let orderU = 3 // len(controlPoints) - 1
        let orderV = 2 // len(controlPoints[0]) - 1

        let controlPoints = [   
            // U = 0
            [ 
                // V = 0..2;
                [ -2.0, -2.0, 1.0, 1 ],
                [  0, -2.0, 0, 1 ],
                [ 2.0, -2.0, -1.0, 1 ]
            ],
            // U = 1
            [ 
                // V = 0..2
                [ -2.0, -1.0, -2.0, 1 ],
                [ 0, -1.0, -1.0, 1  ],
                [ 2.0, -1.0, 2.0, 1 ]
            ],
            // U = 2
            [ 
                // V = 0..2
                [ -2.0, 1.0, 5.0, 1 ],
                [  0, 1.0, 1.5, 1 ],
                [ 2.0, 1.0, -5.0, 1 ]
            ],
            // U = 3
            [ 
                // V = 0..2
                [ -2.0, 2.0, -1.0, 1 ],
                [ 0, 2.0, 0, 1  ],
                [  2.0, 2.0, 1.0, 1 ]
            ]    
        ]

        let surfaceData = this.builder.build(controlPoints, orderU, orderV, this.samplesU, this.samplesV, this.material)
        this.bottom = new THREE.Mesh(surfaceData, this.material);
        this.add(this.bottom)
        this.meshes.push(this.bottom)
    }

    initVaseTop(){
        
    }

    recompute() {

        if (this.meshes !== null) {

            for (let i = 0; i < this.meshes.length; i++) {
              this.app.scene.remove(this.meshes[i])
            }

            this.meshes = []

        }
        this.initVaseBottom();
        this.initVaseTop();
    }
    
}

MyVase.prototype.isGroup = true;

export { MyVase };