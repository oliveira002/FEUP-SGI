import * as THREE from 'three';
import {MyShader} from '../../MyShader.js'

class MyScenery extends THREE.Object3D{

	constructor(app, width, height) {
        super();
		this.app = app
		this.width = width
		this.height = height

		this.geometry = new THREE.PlaneGeometry(10, 10,50,50);
		
		this.heightMapTex = new THREE.TextureLoader().load('../../images/heightmap2.jpg' )
		this.heightMapTex.wrapS = THREE.RepeatWrapping;
		this.heightMapTex.wrapT = THREE.RepeatWrapping;

        this.terrainTex = new THREE.TextureLoader().load('../../images/terrain2.jpg' )
		this.terrainTex.wrapS = THREE.RepeatWrapping;
		this.terrainTex.wrapT = THREE.RepeatWrapping;

		this.altimetry = new THREE.TextureLoader().load('../../images/altimetry.png' )
		this.altimetry.wrapS = THREE.RepeatWrapping;
		this.altimetry.wrapT = THREE.RepeatWrapping;

		this.shader = new MyShader(this.app, 'Terrain Shader', "Terrain Shader", "../../shaders/terrain.vert", "../../shaders/terrain.frag", {
			uSampler1: {type: 'sampler2D', value: this.heightMapTex},
			uSampler2: {type: 'sampler2D', value: this.terrainTex },
			uSampler3: {type: 'sampler2D', value: this.altimetry },
			normScale: {type: 'f', value: 2.0 },
			displacement: {type: 'f', value: 0.0 },
			normalizationFactor: {type: 'f', value: 1 },
		})

		this.waitForShaders()
	}
	
	waitForShaders() {
		if(this.shader.ready === false) {
			setTimeout(this.waitForShaders.bind(this), 100)
			return;
		}

		this.mesh = new THREE.Mesh(this.geometry, this.shader.material);
    	this.mesh.rotateX(-Math.PI / 2);
		this.mesh.scale.set(50,50,50)
		this.add(this.mesh)
	}
}

MyScenery.prototype.isGroup = true;

export {MyScenery}
