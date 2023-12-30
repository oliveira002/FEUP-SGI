import * as THREE from 'three';
import {MyShader} from '../../MyShader.js'

class MyScenery extends THREE.Object3D{

	constructor(app, width, height) {
        super();
		this.app = app
		this.width = width
		this.height = height
		

		this.skybox = new THREE.SphereGeometry(150,100,100)
		
		this.skyboxTex = new THREE.TextureLoader().load('images/skybox.png' )
		this.skyboxTex.wrapS = THREE.RepeatWrapping;
		this.skyboxTex.wrapT = THREE.RepeatWrapping;
		this.skyboxMaterial = new THREE.MeshPhongMaterial({map: this.skyboxTex, side: THREE.DoubleSide, shininess: 20})
		this.skyboxMesh = new THREE.Mesh(this.skybox, this.skyboxMaterial)
		this.add(this.skyboxMesh)

		this.geometry = new THREE.PlaneGeometry(5.7, 5.7, 100, 100);
		
		this.heightMapTex = new THREE.TextureLoader().load('images/heightmap4.jpg' )
		this.heightMapTex.wrapS = THREE.RepeatWrapping;
		this.heightMapTex.wrapT = THREE.RepeatWrapping;

        this.terrainTex = new THREE.TextureLoader().load('images/heightmap8.jpg' )
		this.terrainTex.wrapS = THREE.RepeatWrapping;
		this.terrainTex.wrapT = THREE.RepeatWrapping;

		this.altimetry = new THREE.TextureLoader().load('images/altimetry3.png' )
		this.altimetry.wrapS = THREE.RepeatWrapping;
		this.altimetry.wrapT = THREE.RepeatWrapping;

		this.shader = new MyShader(this.app, 'Terrain Shader', "Terrain Shader", "shaders/terrain.vert", "shaders/terrain.frag", {
			uSampler1: {type: 'sampler2D', value: this.heightMapTex},
			uSampler2: {type: 'sampler2D', value: this.terrainTex },
			uSampler3: {type: 'sampler2D', value: this.altimetry },
			snowHeight: {type: 'f', value: 0.05 },
			mountainHeight: {type: 'f', value: 0.2 },
			otherHeight: {type: 'f', value: 0.8 },
		})

		this.waitForShaders()

		this.floorGeometry = new THREE.PlaneGeometry(5.7, 5.7, 100, 100);
		this.floorTex = new THREE.TextureLoader().load('images/mfloor.jpg' )
		this.floorTex.wrapS = THREE.RepeatWrapping;
		this.floorTex.wrapT = THREE.RepeatWrapping;
		this.floorTex.magFilter = THREE.NearestFilter;
    	this.floorTex.minFilter = THREE.LinearMipMapLinearFilter;
		this.floorMaterial = new THREE.MeshPhongMaterial({map: this.floorTex, side: THREE.DoubleSide, shininess: 20})
	}
	
	waitForShaders() {
		if(this.shader.ready === false) {
			setTimeout(this.waitForShaders.bind(this), 100)
			return;
		}
		this.mesh = new THREE.Mesh(this.geometry, this.shader.material);
		this.mesh.translateY(10.4)
    	this.mesh.rotateX(-Math.PI / 2);
		this.mesh.scale.set(35,35,35)
		this.floorMesh = new THREE.Mesh(this.floorGeometry, this.floorMaterial);
		this.floorMesh.translateY(32.9)
		this.floorMesh.rotateX(-Math.PI / 2);
		this.floorMesh.scale.set(35,35,35)
		this.add(this.mesh, this.floorMesh)
	}
}

MyScenery.prototype.isGroup = true;

export {MyScenery}
