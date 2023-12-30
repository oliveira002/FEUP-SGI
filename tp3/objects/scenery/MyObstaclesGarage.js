import * as THREE from 'three';
import {MyWalls} from './MyWalls.js'
import { MyShelf } from './MyShelf.js';
import { MyBoxStack } from './MyBoxStack.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; // Make sure to import GLTFLoader
import { Reflector } from 'three/addons/objects/Reflector.js';
import { MyCaution } from './MyCaution.js';
import {MyPortrait} from './MyPortrait.js'
import { MyTable } from './MyTable.js';
import { MySpriteSheet } from '../single/MySpriteSheet.js';
import { MyBanana } from '../track/MyBanana.js';
import { MyOil } from '../track/MyOil.js';

class MyObstaclesGarage extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(app) {
        super();
        this.app = app;
        this.type = 'Group';
        this.pickableObjs = []
        this.spritesheet = new MySpriteSheet(15,8, "images/test2.png");
        this.spritesheetRed = new MySpriteSheet(15,8, "images/test3.png");
        this.obsMapping = {}
        this.checkObjs = ["Caution", "Banana", "Oil"]
        this.spriteMapping = {}
        
        this.initFloor()
        this.initCeiling()
        this.initWalls()
        this.initTV()
        this.initTable()
        this.initSupport()
        this.initCone()
        this.initObstacles()
        this.initObsSprites()
        this.initObjs()
        this.initCamera()

        
        const shelfPath = 'images/furniture.jpg'
        this.shelf = new MyShelf(this.app, 6,1.6,5,shelfPath)
        this.shelf.translateX(-8.18)
        this.shelf.translateZ(11.8)
        this.shelf.rotateY(Math.PI/2)
        this.add(this.shelf)

        this.boxStack = new MyBoxStack(this.app, 1.2)
        this.boxStack.translateX(-8.35)
        this.boxStack.translateZ(-12.8)
        this.boxStack.rotateY(Math.PI / 2)
        this.add(this.boxStack)
    }

    initCamera(){
        
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera( 75, aspect, 0.1, 40 )

        let cameraPos = new THREE.Vector3(15,7,0)
        this.camera.position.set(...cameraPos)

        this.app.targets["Obstacles"] = new THREE.Vector3(
            this.position.x-20, 
            this.position.y, 
            this.position.z
        )
        this.camera.lookAt(this.app.targets["Obstacles"])

        this.app.cameras["Obstacles"] = this.camera

        this.add(this.camera)

    }

    initFloor() {
        this.floor = new THREE.PlaneGeometry(18,30)
        this.floorTexture = new THREE.TextureLoader().load('images/floor.jpg');
        this.floorMaterial = new THREE.MeshPhongMaterial({ 
            map: this.floorTexture,
            transparent: true,
            opacity: 0.9
        })

        this.floor = new THREE.PlaneGeometry(18, 30);
        this.floorMesh = new THREE.Mesh( this.floor, this.floorMaterial );
        this.floorMesh.rotation.x = -Math.PI / 2;
        this.floorMesh.position.y = 0;
        this.add( this.floorMesh );

        this.floorMirror = new THREE.PlaneGeometry(18 , 30);
        this.floorMirrorMesh = new Reflector( this.floorMirror, {
            clipBias: 0.003,
            textureWidth: 729,
            textureHeight: 599,
            color: 0xffffff
        });

        this.floorMirrorMesh.rotation.x = -Math.PI / 2;
        this.floorMirrorMesh.position.y = -0.01;
        this.add(this.floorMirrorMesh)

        this.floorTexture.wrapS = THREE.RepeatWrapping;
        this.floorTexture.wrapT = THREE.RepeatWrapping;

        this.floorMaterial = new THREE.MeshPhongMaterial({ 
            map: this.floorTexture,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 1.0
        })
    }

    initCeiling() {
        this.ceiling = new THREE.PlaneGeometry(18,30)

        this.ceilingMaterial = new THREE.MeshPhongMaterial({ 
            map: this.floorTexture,
            side: THREE.DoubleSide
        })

        this.ceilingMesh = new THREE.Mesh( this.ceiling, this.ceilingMaterial);
        this.ceilingMesh.rotation.x = -Math.PI / 2;
        this.ceilingMesh.translateZ(15)
        this.add(this.ceilingMesh)
    }

    initWalls() {
        const wallPath = 'images/wall.png'
        this.walls = new MyWalls(this.app,20,18,30,wallPath,wallPath,wallPath)
        this.walls.translateY(10)
        this.add(this.walls)
    }

    initTV() {
        this.tvWidth = 2
        this.tvLength = 4
        this.tvDepth = 0.02
        this.tvTexturePath = "images/crash_test.mp4"
        this.horizontalTvPieceWidth = this.tvWidth/40
        this.horizontalTvPieceLength = 39*this.tvLength/40
        this.verticalTvPieceWidth = this.tvLength/40
        this.verticalTvPieceLength = 39*this.tvWidth/40
        this.diffuseTvColor = "#000000"
        this.framePath = "images/tv.jpg"
        this.tv = new MyPortrait(this,this.tvWidth,this.tvLength,this.tvDepth, this.tvTexturePath, this.framePath,
            this.horizontalTvPieceWidth, this.horizontalTvPieceLength, this.verticalTvPieceWidth, this.verticalTvPieceLength, this.diffuseTvColor)
        this.tv.translateX(-8.98)
        this.tv.translateY(5)
        this.tv.rotateY(Math.PI/2)
        //this.tv.rotateZ(Math.PI / 32)
        this.add(this.tv)
    }

    initTable() {
        this.tableWidth = 5
        this.tableLength = 2.5
        this.tableHeight = 1.8
        this.tableTexturePath = "images/furniture.jpg"
        this.tableLegTexturePath = "images/furniture.jpg"
        this.table = new MyTable(this, this.tableWidth, this.tableLength, this.tableHeight, undefined, 0.08, this.tableTexturePath, this.tableLegTexturePath)
        this.table.translateY(0.9)
        this.table.translateX(-7.75)
        this.add(this.table)
    }

    initSupport() {
        this.supTexture = new THREE.TextureLoader().load("images/furniture.jpg");
        this.sup = new THREE.BoxGeometry(8,0.15,1)
        this.supMaterial = new THREE.MeshPhongMaterial({ color: "#FFFFFF", 
            specular: "#000000", emissive: "#000000", shininess: 0, map: this.supTexture, transparent: true})
        
        this.supMesh = new THREE.Mesh(this.sup, this.supMaterial)
        this.supMesh.translateY(5.675)
        this.supMesh.translateZ(-11)
        this.supMesh.translateX(-8.5)
        this.supMesh.rotateY(Math.PI / 2)

        this.add(this.supMesh)
    }

    initCone() {
        this.coneGroup = new THREE.Group();

        this.cone = new THREE.CylinderGeometry(0, 0.6, 1.8);
        this.coneTexture = new THREE.TextureLoader().load('images/cone.jpg');
        this.coneTexture.wrapS = THREE.RepeatWrapping;
        this.coneTexture.wrapT = THREE.RepeatWrapping;
        this.coneMaterial = new THREE.MeshPhongMaterial({ map: this.coneTexture });
        this.coneMesh = new THREE.Mesh(this.cone, this.coneMaterial);
        this.coneMesh.translateY(1);

        this.coneSup = new THREE.BoxGeometry(1.2, 0.2, 1.2);
        this.coneSupMaterial = new THREE.MeshPhongMaterial({ emissive: "#895c38", color: "#895c38" });
        this.coneSupMesh = new THREE.Mesh(this.coneSup, this.coneSupMaterial);
        this.coneSupMesh.translateY(0.1);
        this.coneGroup.add(this.coneMesh, this.coneSupMesh);

        this.coneGroup.scale.set(0.7, 0.7, 0.7)
        this.coneGroup.translateX(-8)
        this.coneGroup.translateY(2)
        this.coneGroup.translateZ(13.25)
        this.add(this.coneGroup);
    }

    initObjs() {
        const loader = new GLTFLoader();
        var textureLoader = new THREE.TextureLoader();

        loader.load(
            'images/game_ready__car_tires.glb',
            (gltf) => {
                var model = gltf.scene
                model.scale.set(2.5,2.5,2.5)
                model.translateX(-8)
                model.translateZ(8)
                this.add(model); 
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.log('An error happened', error);
            }
        );

        loader.load(
            'images/fuel_tank.glb',
            (gltf) => {
                var model = gltf.scene
                model.scale.set(3.5,3.5,3.5)
                model.rotateY(-Math.PI * 1.1)
                model.translateX(6)
                model.translateZ(-7.5)
                this.add(model); 
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.log('An error happened', error);
            }
        );

        loader.load(
            'images/metal_ladder.glb',
            (gltf) => {
                var model = gltf.scene
                model.scale.set(0.07,0.07,0.07)
                model.translateZ(12.95)
                model.translateY(0.44)

                model.rotateZ(Math.PI/2)
                model.rotateY(Math.PI)
                textureLoader.load('images/furniture.jpg', (texture) => {
                    model.traverse((child) => {
                        if (child.isMesh) {
                            child.material.map = texture;
                        }
                    });
                })

                //model.rotateX(-Math.PI/2)
                this.add(model); 
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.log('An error happened', error);
            }
        );

        loader.load(
            'images/cork_board.glb',
            (gltf) => {
                var model = gltf.scene
                model.scale.set(2,2,2)
                model.translateY(4)
                model.translateZ(14.95)
                model.rotateY(-Math.PI)
                this.add(model); 
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.log('An error happened', error);
            }
        );

        loader.load(
            'images/used_tire__tyre.glb',
            (gltf) => {
                var model = gltf.scene;
                model.scale.set(0.015, 0.015, 0.015);
                
                /*textureLoader.load('images/tire.jpg', (texture) => {
                    model.traverse((child) => {
                        if (child.isMesh) {
                            child.material.map = texture;
                        }
                    });
                })*/
                // Create 8 instances of the model with spacing
                for (var i = 0; i < 10; i++) {
                    var clonedModel = model.clone();
                    clonedModel.position.z = -i * 0.55;
                    clonedModel.translateZ(-7.4)
                    clonedModel.translateX(-8.2)
                    clonedModel.translateY(5.75)
                    this.add(clonedModel);
                }

                for (var i = 0; i < 2; i++) {
                    var clonedModel = model.clone();
                    clonedModel.translateY(5.75)
                    clonedModel.translateY(i * 0.54 + 0.3)
                    clonedModel.translateZ(-14.2)
                    clonedModel.translateX(-8.2)
                    if (i == 1) {
                        clonedModel.translateY(0.05)
                        clonedModel.rotateX(Math.PI / 32) 
                    }
                    clonedModel.rotateX(Math.PI / 2)
                    this.add(clonedModel);
                }
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.log('An error happened', error);
            }
        );
    }

    initObsSprites() {
        this.bananaSprite = this.spritesheet.createTextGroup("Banana");
        this.bananaSprite.translateY(3)
        this.bananaSprite.translateZ(6)
        this.bananaSprite.translateX(2.5)
        this.bananaSprite.scale.set(5,5,5)
        this.bananaSprite.rotateY(Math.PI / 2)
        this.spriteMapping["Banana"] = this.bananaSprite
    
        this.oilSprite = this.spritesheet.createTextGroup("Oil")

        this.oilSprite.translateY(3)
        this.oilSprite.translateZ(-5)
        this.oilSprite.translateX(2.5)
        this.oilSprite.scale.set(5,5,5)
        this.oilSprite.rotateY(Math.PI / 2)
        this.spriteMapping["Oil"] = this.oilSprite


        this.cautionSprite = this.spritesheet.createTextGroup("Caution")
        this.cautionSprite.translateY(3)
        this.cautionSprite.translateX(2.5)
        this.cautionSprite.translateZ(1)
        this.cautionSprite.scale.set(5,5,5)
        this.cautionSprite.rotateY(Math.PI / 2)
        this.spriteMapping["Caution"] = this.cautionSprite
    
        this.add(this.bananaSprite, this.oilSprite, this.cautionSprite)
    }

    initObstacles() {
        this.banana = new MyBanana(this.app)
        this.banana.translateX(3)
        this.banana.translateZ(5)
        this.banana.rotateY(Math.PI / 1.8)
        this.pickableObjs.push(this.banana)
        this.obsMapping["Banana"] = this.banana
        this.add(this.banana)

        this.oil = new MyOil(this.app)
        this.oil.translateX(3)
        this.oil.translateY(0.01)
        this.oil.translateZ(-5)
        this.pickableObjs.push(this.oil)
        this.obsMapping["Oil"] = this.oil
        this.add(this.oil)

        this.caution = new MyCaution(this.app,0.8,0.14,1.6)
        this.caution.translateY(Math.sin(Math.PI /3) * 0.8)
        this.caution.translateX(3)
        this.caution.translateZ(-0.2)
        this.caution.rotateY(Math.PI / 1.8)
        this.pickableObjs.push(this.caution)
        this.obsMapping["Caution"] = this.caution
        this.add(this.caution)
    }
}

MyObstaclesGarage.prototype.isGroup = true;

export { MyObstaclesGarage };