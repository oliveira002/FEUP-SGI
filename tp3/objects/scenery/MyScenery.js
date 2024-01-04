import * as THREE from 'three';
import {MyShader} from '../../MyShader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MyTree } from './MyTree.js';
import { MyBillboard } from './MyBillboard.js';

class MyScenery extends THREE.Object3D{

	constructor(app, width, height) {
        super();
		this.app = app
		this.width = width
		this.height = height

		this.createTreeInstances(10, {
			minX: -60,
			maxX: -6,
			minZ: 40,
			maxZ: 70,
		})

		this.createTreeInstances(10, {
		minX: -35,
		maxX: 26,
		minZ: -40,
		maxZ: -70,
		})
		this.app.scene.fog = new THREE.Fog( 0xcccccc, 20,505);

		this.skyboxTex = new THREE.TextureLoader().load('images/sky.jpg');
		this.skyboxTex.mapping = THREE.EquirectangularReflectionMapping;
		this.skyboxTex.magFilter = THREE.LinearFilter;
		this.skyboxTex.minFilter = THREE.LinearMipMapLinearFilter;  // Update minFilter

		this.skybox = new THREE.SphereGeometry(200, 100, 100);

		this.skyboxMaterial = new THREE.MeshPhysicalMaterial({
			envMap: this.skyboxTex,
			side: THREE.DoubleSide,
			thickness: 1,
			roughness: 0.05,
			reflectivity: 0.8,
			transmission: 1,
		});
				
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

		this.initClouds()

		this.floorGeometry = new THREE.PlaneGeometry(5.7, 5.7, 10, 10);
		
		this.floorTex = new THREE.TextureLoader().load('images/mfloor3.jpg' )
		this.floorTex.wrapS = THREE.RepeatWrapping;
		this.floorTex.wrapT = THREE.RepeatWrapping;
		//this.floorTex.magFilter = THREE.NearestFilter;
    	//this.floorTex.minFilter = THREE.LinearMipMapLinearFilter;
		this.floorMaterial = new THREE.MeshPhongMaterial({bumpMap: this.floorTex, bumpScale: 1,map: this.floorTex, side: THREE.DoubleSide, shininess: 20})

		this.billboard = new MyBillboard(this.app)
		this.billboard.translateY(33)
		this.billboard.translateX(85)
		this.billboard.rotateY(-Math.PI /2 )
		this.add(this.billboard)

		this.initLights()
	}
	
	initLights(){
		const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
		directionalLight.position.set(0, 100, 50)
		directionalLight.castShadow = true
		this.add(directionalLight)
	}


	waitForShaders() {
		if(this.shader.ready === false) {
			setTimeout(this.waitForShaders.bind(this), 100)
			return;
		}
		this.mesh = new THREE.Mesh(this.geometry, this.shader.material);
		this.mesh.translateY(5.3)
    	this.mesh.rotateX(-Math.PI / 2);
		this.mesh.scale.set(48,48,48)
		this.floorMesh = new THREE.Mesh(this.floorGeometry, this.floorMaterial);
		this.floorMesh.translateY(32.97)
		this.floorMesh.rotateX(-Math.PI / 2);
		this.floorMesh.scale.set(48,48,48)
		this.add(this.mesh, this.floorMesh)
	}

	createTreeInstances(N, bounds) {
		for (let i = 0; i < N; i++) {
		  const tree = new MyTree(this.app);
	  
		  // Set random positions within the specified bounds
		  const posX = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
		  const posY = 32.8;
		  const posZ = bounds.minZ + Math.random() * (bounds.maxZ - bounds.minZ);
	  
		  tree.position.set(posX, posY, posZ);
		  this.add(tree)
		}
	}

	initClouds() {
		const loader = new GLTFLoader();
		const cloudCount = 10;
	
		loader.load(
			'images/Clouds.glb',
			(gltf) => {
				const originalCloud = gltf.scene;
				originalCloud.scale.set(50, 50, 50);
				originalCloud.translateY(100);

	
				for (let i = 0; i < cloudCount; i++) {
					const clonedCloud = originalCloud.clone();
					const xPos = Math.random() * 140 - 50; // Adjust range as needed
					const zPos = Math.random() * 140 - 50; // Adjust range as needed
					const yRotation = Math.random() * Math.PI * 2; // Random Y rotation in radians

					clonedCloud.position.set(xPos, 100, zPos);
					clonedCloud.rotation.set(0, yRotation, 0);

					this.add(clonedCloud);
				}
			},
			(xhr) => {
				//console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
			},
			(error) => {
				console.log('An error happened', error);
			}
		);
	}
}

MyScenery.prototype.isGroup = true;

export {MyScenery}
