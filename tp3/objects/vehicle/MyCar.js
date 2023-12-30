import * as THREE from 'three';
import { MyApp } from '../../MyApp.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { degToRad } from '../../utils.js';

class MyCar extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(app, name, position=null) {
        super();
        this.app = app;
        this.type = 'Group';
        this.pressedKeys = { w: false, a: false, s: false, d: false };
        this.name = name
        this.loaded = false
        
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
        this.brakingFactor = 0.99
        this.dragFactor = 0.995

        // Acceleration
        this.accelerationFactor = 1.02

        this.init()

    }

    init(){

        const loader = new GLTFLoader();

        loader.load(
            'images/Nissan_Silvia_S15.glb',
            (gltf) => {
                this.car = gltf.scene
                this.car.name = "car"
                this.car.rotateY(degToRad(90))
                this.car.scale.set(10,10,10)
                this.add(this.car);
                console.log(this.car) 
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.log('An error happened', error);
            }
          );

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
                break;
            case "keyup":
                if(key === "w") this.pressedKeys.w = false;
                if(key === "a") this.pressedKeys.a = false;
                if(key === "s") this.pressedKeys.s = false;
                if(key === "d") this.pressedKeys.d = false;
                break;
            default:
                console.error("Invalid event type:", type)
        }
    }

    update(){
        
        // Break
        if(this.pressedKeys.s) {
            this.speed = this.brakingFactor * this.speed
        }
        else{ 
            // Accelerate
            if(this.pressedKeys.w) {
                if(this.speed === 0) this.speed = this.minSpeed
                else this.speed *= this.accelerationFactor;
            }
            else this.speed = Math.max(this.speed * this.dragFactor, 0)
        }

        if(this.speed < this.minSpeed) this.speed = 0;
        if(this.speed > this.maxSpeed) this.speed = this.maxSpeed

        // Update position based on local direction
        const deltaPosition = new THREE.Vector3().copy(this.dir).multiplyScalar(this.speed);
        this.pos.add(deltaPosition);

        this.prevDir = new THREE.Vector3(...this.dir)

        let angle = 0;
        if(this.speed !== 0){
            // Rotate Left or Right
            if(this.pressedKeys.a && !this.pressedKeys.d) {
                this.dir.applyAxisAngle(new THREE.Vector3(0,1,0), this.turningAngle);
                angle = this.turningAngle
            }
            if(this.pressedKeys.d && !this.pressedKeys.a) {
                this.dir.applyAxisAngle(new THREE.Vector3(0,1,0), -this.turningAngle);
                angle = -this.turningAngle
            }
        }

        // Update rotation using quaternion
        const quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        this.quaternion.multiplyQuaternions(quaternion, this.quaternion);

        // Update position
        this.position.set(this.pos.x, this.pos.y, this.pos.z);

        this.updateCameraPos()
        this.updateCameraTarget()

    }


}

MyCar.prototype.isGroup = true;

export { MyCar };