import * as THREE from 'three';
import {MyWalls} from './MyWalls.js'
import { MyShelf } from './MyShelf.js';
import { MyBoxStack } from './MyBoxStack.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; // Make sure to import GLTFLoader
import { Reflector } from 'three/addons/objects/Reflector.js';
import { MyCaution } from '../track/MyCaution.js';
import {MyPortrait} from './MyPortrait.js'
import { MyTable } from './MyTable.js';
import { MySpriteSheet } from '../single/MySpriteSheet.js';
import { MyFirework } from '../single/MyFirework.js';

class MyPodium extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(app, winner, loser, time) {
        super();
        this.app = app;
        this.type = 'Group';
        this.pickableObjs = []
        this.carMap = {"Nissan S15": [2.5,4,-3.6], "Lambo": [2.5,4,4.5]}
        this.spritesheet = new MySpriteSheet(15,8, "images/test2.png");
        this.spritesheetRed = new MySpriteSheet(15,8, "images/test3.png");
        this.carMapping = {}
        this.checkObjs = ["Nissan S15", "Lambo"]
        this.spriteMapping = {}
        this.winner = winner
        this.loser = loser
        this.res = [this.winner, this.loser]
        this.elapsedTime = time
        
        this.initFloor()
        this.initCeiling()
        this.initWalls()
        this.initObjs()
        this.initTV()
        this.initTable()
        this.initSupport()
        this.initCone()
        this.initCamera()
        this.initCars()
        this.initCarSprites()

        
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

        this.fireworks = []

    }

    initCamera(){
        
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera( 75, aspect, 0.1, 40 )

        let cameraPos = new THREE.Vector3(15,7,0)
        this.camera.position.set(...cameraPos)

        this.app.targets["Podium"] = new THREE.Vector3(
            this.position.x-20, 
            this.position.y, 
            this.position.z
        )
        this.camera.lookAt(this.app.targets["Podium"])

        this.app.cameras["Podium"] = this.camera

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
                //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
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
                //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
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
                //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
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
                //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
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
                //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.log('An error happened', error);
            }
        );
    }

    initTV() {
        this.tvWidth = 2
        this.tvLength = 4
        this.tvDepth = 0.02
        this.tvTexturePath = "images/garage_intro.mp4"
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

    initCarSprites() {
        this.initWinner()
        this.initLoser()
    }

    initWinner() {
        var name = this.winner[0]
        var car = this.winner[1]
        var time = this.winner[2]

        time = this.formatTime(time)

        var val = 0
        if(car == "Lambo") val -= 0.9


        this.winnerSprite = this.spritesheetRed.createTextGroup("Winner")
        this.winnerSprite.position.set(this.carMap[car][0], this.carMap[car][1], this.carMap[car][2] + val)
        this.winnerSprite.scale.set(5,5,5)
        this.winnerSprite.rotateY(Math.PI / 2)

        this.winnerNameSprite = this.spritesheetRed.createTextGroup(name)
        this.winnerNameSprite.position.set(this.carMap[car][0], this.carMap[car][1] - 1, this.carMap[car][2] + val)
        this.winnerNameSprite.scale.set(5,5,5)
        this.winnerNameSprite.rotateY(Math.PI / 2)

        this.timeSprite = this.spritesheetRed.createTextGroup("Time")
        this.timeSprite.translateY(7)
        this.timeSprite.translateX(-4.5)
        this.timeSprite.translateZ(0.5)
        this.timeSprite.scale.set(5,5,5)
        this.timeSprite.rotateY(Math.PI / 2)

        this.actTimeSprite = this.spritesheetRed.createTextGroup(String(time))
        this.actTimeSprite.translateY(6.2)
        this.actTimeSprite.translateX(-4.5)
        this.actTimeSprite.translateZ(1.2)
        this.actTimeSprite.scale.set(5,5,5)
        this.actTimeSprite.rotateY(Math.PI / 2)


        this.add(this.winnerSprite, this.winnerNameSprite, this.timeSprite, this.actTimeSprite)
    }

    initLoser() {
        var name = this.loser[0]
        var car = this.loser[1]
        var time = this.loser[2]

        var val = 0
        if(car == "Lambo") val = -0.7
        if(car == "Nissan S15") val = 0.5

        this.loserSprite = this.spritesheet.createTextGroup("Loser")
        this.loserSprite.position.set(this.carMap[car][0], this.carMap[car][1], this.carMap[car][2] + val)
        this.loserSprite.scale.set(5,5,5)
        this.loserSprite.rotateY(Math.PI / 2)

        this.loserNameSprite = this.spritesheet.createTextGroup(name)
        this.loserNameSprite.position.set(this.carMap[car][0], this.carMap[car][1] - 1, this.carMap[car][2] + val)
        this.loserNameSprite.scale.set(5,5,5)
        this.loserNameSprite.rotateY(Math.PI / 2)

        this.add(this.loserSprite, this.loserNameSprite)
    }

    formatTime(seconds) {
        var hours = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds % 3600) / 60);
        var remainingSeconds = seconds % 60;
      
        var formattedTime = 
          (hours < 10 ? '0' : '') + hours + ':' +
          (minutes < 10 ? '0' : '') + minutes + ':' +
          (remainingSeconds < 10 ? '0' : '') + remainingSeconds;
      
        return formattedTime;
      }

    initCars() {

        const loader = new GLTFLoader();
    
        loader.load(
          'images/Nissan_Silvia_S15.glb',
          (gltf) => {
              this.nissan_s15 = gltf.scene
              this.nissan_s15.scale.set(2,2,2)
              this.nissan_s15.rotateY(Math.PI / 2.15)
              this.nissan_s15.translateX(4.5)
              this.nissan_s15.translateZ(0.5)
              this.nissan_s15.name = "Nissan S15"
              this.add(this.nissan_s15); 
              this.carMapping["Nissan S15"] = this.nissan_s15
    
          },
          (xhr) => {
              //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
          },
          (error) => {
              console.log('An error happened', error);
          }
      );
    
        loader.load(
          'images/lambo.glb',
          (gltf) => {
              this.lambo = gltf.scene
              this.lambo.scale.set(0.013,0.013,0.013)
              this.lambo.rotateY(Math.PI / 1.9)
              this.lambo.translateX(-3.2)
              this.lambo.translateZ(2)

              this.lambo.name = "Lambo"
              this.add(this.lambo); 
              this.carMapping["Lambo"] = this.lambo
          },
          (xhr) => {
              //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
          },
          (error) => {
              console.log('An error happened', error);
          }
        );
    }

    update() {
        if(Math.random()  < 0.05 ) {
            var firework = new MyFirework(this.app)
            this.add(firework)
            this.fireworks.push(firework)
        }
        for( let i = 0; i < this.fireworks.length; i++ ) {
            if (this.fireworks[i].done) {
                this.fireworks.splice(i,1) 
                continue 
            }
            this.fireworks[i].update()

        }
    }
}

MyPodium.prototype.isGroup = true;

export { MyPodium };