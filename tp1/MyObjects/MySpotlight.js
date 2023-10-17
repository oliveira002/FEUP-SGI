import * as THREE from 'three';
import { MyApp } from '../MyApp.js';

class MySpotlight extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(app, spotLightPos, spotLightLookAt) {
        super();
        this.app = app;
        this.type = 'Group';
        this.color = 0x000000
        this.spotLightPos = spotLightPos || new THREE.Vector3(0,0,0)
        this.spotLightLookAt = spotLightLookAt || new THREE.Vector3(0,0,0)
        this.normal = new THREE.Vector3(0,-1,0)

        const base = new THREE.CylinderGeometry(0.2, 0.2, .4);
        const baseMaterial = new THREE.MeshPhysicalMaterial({ 
            color: this.color,
            roughness: 0.3,
            metalness: 1,
        });
        const baseMesh = new THREE.Mesh( base, baseMaterial ) ;

        const lensHolder = new THREE.CylinderGeometry(0.17, 0.2, .1, 32, 1, true);
        const lensHolderMaterial = new THREE.MeshPhysicalMaterial({ 
            color: this.color, 
            side: THREE.DoubleSide,
            roughness: 0.3,
            metalness: 1,
        });
        const lensHolderMesh = new THREE.Mesh( lensHolder, lensHolderMaterial ) ;
        lensHolderMesh.translateY(-(.1/2 + .4/2))

        const lens = new THREE.CylinderGeometry(0.1825-0.001, 0.1875-0.001, 0.01)
        const lensMaterial = new THREE.MeshPhysicalMaterial({
            roughness: 0.7,
            transmission: 1,
            thickness: 1,
        });
        const lensMesh = new THREE.Mesh(lens, lensMaterial);
        lensMesh.translateY(-(.1/2 + .4/2))
        
        const spotlight = new THREE.Group();
        spotlight.add( baseMesh, lensHolderMesh, lensMesh);
        
        this.normal.normalize()
        this.dir = new THREE.Vector3(0,0,0).subVectors(this.spotLightLookAt, this.spotLightPos).normalize()
        
        this.angle = this.normal.angleTo(this.dir)
    
        this.axis = new THREE.Vector3(0,0,0)
        this.axis.crossVectors(this.normal, this.dir)

        spotlight.rotateOnAxis(this.axis, this.angle)

        this.add(spotlight)

        const supportVert = new THREE.BoxGeometry(0.02, 0.5, 0.06)
        const supportHor = new THREE.BoxGeometry(0.2*2, 0.02, 0.06)
        const mount = new THREE.CylinderGeometry(0.2/2,0.2/2,0.03)
        const supportMaterial = new THREE.MeshPhysicalMaterial({ 
            color: this.color,
            roughness: 0.3,
            metalness: 1,
        });
        const supportVertMesh1 = new THREE.Mesh( supportVert, supportMaterial ) ;
        supportVertMesh1.translateX(0.2+0.02/2)
        supportVertMesh1.translateY(0.5/2)
        const supportVertMesh2 = new THREE.Mesh( supportVert, supportMaterial ) ;
        supportVertMesh2.translateX(-(0.2+0.02/2))
        supportVertMesh2.translateY(0.5/2)
        const supportHorMesh = new THREE.Mesh( supportHor, supportMaterial ) ;
        supportHorMesh.translateY(-.02/2+0.5)
        const mountMesh = new THREE.Mesh(mount, supportMaterial)
        mountMesh.translateY(0.5+0.03/2)


        const support = new THREE.Group();
        support.add( supportVertMesh1, supportVertMesh2, supportHorMesh, mountMesh);
        this.add(support)

        this.position.set(...this.spotLightPos)
    }
}

MySpotlight.prototype.isGroup = true;

export { MySpotlight };