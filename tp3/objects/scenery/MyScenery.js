import * as THREE from 'three';
import {MyShader} from '../../MyShader.js'

class MyScenery extends THREE.Object3D{

	constructor(app, width, height) {
        super();
		this.app = app
		this.geometry = new THREE.PlaneGeometry(width, height);
		this.material = new THREE.MeshPhongMaterial( { side: THREE.DoubleSide } );
        this.material.wireframe = false;
		this.material.needsUpdate = true; 
		this.mesh = new THREE.Mesh( this.geometry, this.material )
		this.mesh.rotateX(-Math.PI/2)
        this.setFillMode()



        this.heightMapTex = new THREE.TextureLoader().load('../../images/heightmap.jpg' )
        this.terrainTex = new THREE.TextureLoader().load('../../images/terrain.jpg' )

        this.heightMapTex.wrapS = THREE.RepeatWrapping;
        this.heightMapTex.wrapT = THREE.RepeatWrapping;

        this.terrainTex.wrapS = THREE.RepeatWrapping;
        this.terrainTex.wrapT = THREE.RepeatWrapping;
	}

    setFillMode() { 
		this.material.wireframe = false;
		this.material.needsUpdate = true;
	}
}

MyScenery.prototype.isGroup = true;

export {MyScenery}
