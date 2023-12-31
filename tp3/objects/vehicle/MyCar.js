import * as THREE from 'three';
import { MyApp } from '../../MyApp.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { degToRad } from '../../utils.js';
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast, MeshBVHVisualizer } from 'three-mesh-bvh';

class MyCar extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(app, name, position=null, model, track) {
        super();
        this.app = app;
        this.type = 'Group';
        this.pressedKeys = { w: false, a: false, s: false, d: false, space: false };
        this.name = name
        this.loaded = false
        this.raycasters = []
        this.track = track

        THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
        THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
        THREE.Mesh.prototype.raycast = acceleratedRaycast;
        this.wheels = []
        this.modelMapping = {}
        this.model = model
        
        // Position
        this.pos = position ?? new THREE.Vector3(0, 0, 0)

        // Direction (in rad)
        this.dir = new THREE.Vector3(1, 0, 0)
        this.prevDir = this.dir
        this.turningAngle = 2*Math.PI/350

        // speed
        this.speed = 0
        this.minSpeed = 0.008
        this.maxSpeed = 0.1
        this.brakingFactor = 0.985
        this.dragFactor = 0.995

        // Acceleration
        this.accelerationFactor = 1.01

        this.init()

    }

    init(){

        const loader = new GLTFLoader();

        if(this.model === "Silvia") {
            loader.load(
                'images/Nissan_Silvia_S15.glb',
                (gltf) => {
                    this.car = gltf.scene;
                    this.car.name = "car";
                    this.car.position.set(0,0,0)
                    //this.car.position.set(0.02, -0.4, -0.72);
            
                    let helpers = [];
            
                    this.car.traverse((o) => {
                        if (o.isMesh) {
                            let originalGeo = o.geometry;
                            let scaledGeo = originalGeo.clone();
                            let mesh = new THREE.Mesh(scaledGeo, o.material);
            
                            mesh.position.set(this.car.position.x - 0.02, this.car.position.y + 0.4, this.car.position.z + 0.72);
                            mesh.geometry.computeBoundsTree();
            
                            let helper = new MeshBVHVisualizer(mesh);
                            helper.update();
                            helpers.push(helper);
                        }
                    });
            
                    this.helpers = helpers;
                    this.add(...this.helpers);
                    this.add(this.car);
                    console.log(this.car)
            
                    this.wheels.push(this.car.children[0].children[1]);
                    this.wheels.push(this.car.children[0].children[2]);

                    let dir = new THREE.Vector3(0,-1,0)
                    this.raycasters = [
                        new THREE.Raycaster(
                            new THREE.Vector3(0.5235543251037598, 0.2165137678384781, 1.710374355316162),
                            dir,
                            0, 
                            1
                        ),
                        new THREE.Raycaster(
                            new THREE.Vector3(-0.5251612067222595, 0.2165137529373169, 1.710374355316162),
                            dir,
                            0, 
                            1
                        ),
                        new THREE.Raycaster(
                            new THREE.Vector3(0.5235543251037598, 0.2165137678384781, 0),
                            dir,
                            0, 
                            1
                        ),
                        new THREE.Raycaster(
                            new THREE.Vector3(-0.5251612067222595, 0.2165137529373169, 0),
                            dir,
                            0, 
                            1
                        )
                    ]

                    this.raycasters.forEach( raycaster => {
                        var arrow = new THREE.ArrowHelper( raycaster.ray.direction, raycaster.ray.origin, 8, 0xff0000 );
                        this.add(arrow)
                    })


                },
                (xhr) => {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                (error) => {
                    console.log('An error happened', error);
                }
            );
        }
        else if(this.model === "Lambo") {
            loader.load(
                'images/lambo.glb',
                (gltf) => {
                    this.car = gltf.scene
                    this.car.name = "car"
                    this.car.scale.set(0.003,0.003,0.003)

                    let helpers = []
    
                    this.car.traverse((o) => {
                        if (o.isMesh) {
                            let geo = o.geometry;
                            let scaledGeo = geo.clone();
                            
                            scaledGeo.scale(this.car.scale.x, this.car.scale.y, this.car.scale.z);      
                            scaledGeo.computeBoundsTree();
            
                            let mesh = new THREE.Mesh(scaledGeo, o.material);
                            mesh.position.copy(o.position);
                            mesh.rotation.copy(o.rotation);
                            mesh.scale.copy(o.scale);
            
                            let helper = new MeshBVHVisualizer(mesh);
                            helper.update();
                            helpers.push(helper);
                        }
                    });
                    this.helpers = helpers
                    this.add(...this.helpers)

                    this.add(this.car); 

                    this.wheels.push(this.car.children[2])
                    this.wheels.push(this.car.children[3])
                    this.wheels.forEach(wheel => {
                        const wheelCenter = new THREE.Vector3();
                        wheel.geometry.computeBoundingBox();
                        wheel.geometry.boundingBox.getCenter(wheelCenter);
                    
                        const offset = wheelCenter.clone().sub(wheel.position);
                    
                        wheel.geometry.center();
                    
                        wheel.position.add(offset);
                    });

                },
                (xhr) => {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                (error) => {
                    console.log('An error happened', error);
                }
            );
        }

        this.rotateY(degToRad(90))

        this.initCamera()

    }

    initCamera(){
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera( 100, aspect, 0.1, 1000 )


        this.app.cameras[this.name] = this.camera

        this.updateCameraTarget()

    }

    updateCameraPos(){

        let cameraPos = this.dir.clone().multiplyScalar(-1)
        cameraPos.x *= 2
        cameraPos.z *= 2
        
        cameraPos.add(new THREE.Vector3(0,2,0))
        cameraPos.add(this.position)

        this.camera.position.set(...cameraPos)

    }

    updateCameraTarget(){
        this.app.targets[this.name] = new THREE.Vector3(
            this.position.x, 
            this.position.y, 
            this.position.z
        )
        this.camera.lookAt(this.app.targets[this.name])
    }

    updateKeyPressed(type, key){
        switch (type){
            case "keydown":
                if(key === "w") this.pressedKeys.w = true;
                if(key === "a") this.pressedKeys.a = true;
                if(key === "s") this.pressedKeys.s = true;
                if(key === "d") this.pressedKeys.d = true;
                if(key === " ") this.pressedKeys.space = true;
                break;
            case "keyup":
                if(key === "w") this.pressedKeys.w = false;
                if(key === "a") this.pressedKeys.a = false;
                if(key === "s") this.pressedKeys.s = false;
                if(key === "d") this.pressedKeys.d = false;
                if(key === " ") this.pressedKeys.space = false;
                break;
            default:
                console.error("Invalid event type:", type)
        }
    }

    updatePosition(){
        // Brake
        if(this.pressedKeys.space) {
            this.speed *= this.brakingFactor
        }
        else{ 
            // Accelerate
            if(this.pressedKeys.w) {
                if(this.speed === 0) this.speed = this.minSpeed
                if(this.speed < 0) this.speed *= this.brakingFactor
                if(this.speed > 0) this.speed *= this.accelerationFactor;

            }
            else if(this.pressedKeys.s) {
                if(this.speed === 0) this.speed = -this.minSpeed
                if(this.speed < 0) this.speed *= this.accelerationFactor;
                if(this.speed > 0) this.speed *= this.brakingFactor
            }
            else this.speed = Math.sign(this.speed) * Math.max(Math.abs(this.speed * this.dragFactor), 0)
        }

        if(Math.abs(this.speed) < this.minSpeed) this.speed = 0;
        if(this.speed > this.maxSpeed) this.speed = this.maxSpeed
        if(this.speed < -this.maxSpeed/3) this.speed = -this.maxSpeed/3

        // Update position based on local direction
        const deltaPosition = new THREE.Vector3().copy(this.dir).multiplyScalar(this.speed);
        this.pos.add(deltaPosition);

        this.prevDir = new THREE.Vector3(...this.dir)

        this.updateAngle()

        // Update position
        this.position.set(this.pos.x, this.pos.y, this.pos.z);
    }

    updateAngle(){
        let angle = 0;
        let wheelAngle = 0;


        if(this.speed !== 0){
            if(this.pressedKeys.a && !this.pressedKeys.d) {
                this.dir.applyAxisAngle(new THREE.Vector3(0,1,0), this.turningAngle * Math.sign(this.speed));
                angle = this.turningAngle * Math.sign(this.speed)
            }
            if(this.pressedKeys.d && !this.pressedKeys.a) {
                this.dir.applyAxisAngle(new THREE.Vector3(0,1,0), -this.turningAngle * Math.sign(this.speed));
                angle = -this.turningAngle * Math.sign(this.speed)
            }
        }

        else {
            if(this.pressedKeys.a && !this.pressedKeys.d) {
                wheelAngle = this.turningAngle 
            }
            if(this.pressedKeys.d && !this.pressedKeys.a) {
                wheelAngle = -this.turningAngle 
            }
        }

        const quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        this.quaternion.multiplyQuaternions(quaternion, this.quaternion);

        
        this.wheels.forEach(wheel => {
            this.rotateWheel(wheel, angle, wheelAngle)
        });

    }

    rotateWheel(wheel, angle, wheelAngle) {
        switch(this.model) {
            case "Silvia":
                if(this.speed === 0 && wheelAngle != 0) {
                    wheelAngle = wheelAngle
                }
                
                else if(angle === 0) {
                    wheelAngle = Math.sign(wheel.rotation.z) * -0.01
                }
                else {
                    wheelAngle = angle / 2
                }
                
    
                wheel.rotateZ(wheelAngle / 2)
                
                if(Math.abs(wheel.rotation.z + wheelAngle) > Math.PI / 5) {
                    wheel.rotation.z = Math.sign(wheelAngle) * Math.PI / 5
                }
                break;
            
            case "Lambo":
                if(this.speed === 0 && wheelAngle != 0) {
                    wheelAngle = wheelAngle
                }
                
                else if(angle === 0) {
                    wheelAngle = Math.sign(wheel.rotation.y) * -0.01
                }
                else {
                    wheelAngle = angle / 2
                }
                
    
                wheel.rotateY(wheelAngle / 2)
                
                if(Math.abs(wheel.rotation.y + wheelAngle) > Math.PI / 5) {
                    wheel.rotation.y = Math.sign(wheelAngle) * Math.PI / 5
                }

                break;
        }
    }

    updateSpeedBasedOnTrackBounds(){
        this.raycasters.forEach( raycaster => {
            const intersections = raycaster.intersectObjects( this.track );
            console.log(intersections) 
            if(intersections.length === 0){
               //console.log("out") 
            }
        })
    }

    update(){

       if(this.helpers)
            this.helpers.forEach(helper => {
                helper.update()
            })

        this.updatePosition()
        this.updateCameraPos()
        this.updateCameraTarget()
        this.updateSpeedBasedOnTrackBounds()
    }


}

MyCar.prototype.isGroup = true;

export { MyCar };