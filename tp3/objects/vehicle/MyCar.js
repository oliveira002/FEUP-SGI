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
    constructor(app, name, position=null) {
        super();
        this.app = app;
        this.type = 'Group';
        this.pressedKeys = { w: false, a: false, s: false, d: false, space: false };
        this.name = name
        this.loaded = false

        THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
        THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
        THREE.Mesh.prototype.raycast = acceleratedRaycast;
        
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
        this.accelerationFactor = 1.012

        this.init()

    }

    init(){

        const loader = new GLTFLoader();

        loader.load(
            'images/Nissan_Silvia_S15.glb',
            (gltf) => {
                this.car = gltf.scene
                this.car.name = "car"
                this.car.position.set(0.02,-0.4,-0.72)
                //this.car.scale.set(10,10,10)

                let helpers = []

                this.car.traverse( function( o ) {

                    if ( o.isMesh ){
                        let geo = o.geometry
                        geo.computeBoundsTree()
                        let helper = new MeshBVHVisualizer(o)
                        helper.update()
                        helpers.push(helper)
                    }
                
                } );
                console.log(this.car)

                this.add(this.car);
                this.helpers = helpers
                console.log(this.helpers)
                this.add(...this.helpers)
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.log('An error happened', error);
            }
          );

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
        if(this.speed !== 0){
            // Rotate Left or Right
            if(this.pressedKeys.a && !this.pressedKeys.d) {
                this.dir.applyAxisAngle(new THREE.Vector3(0,1,0), this.turningAngle * Math.sign(this.speed));
                angle = this.turningAngle * Math.sign(this.speed)
            }
            if(this.pressedKeys.d && !this.pressedKeys.a) {
                this.dir.applyAxisAngle(new THREE.Vector3(0,1,0), -this.turningAngle * Math.sign(this.speed));
                angle = -this.turningAngle * Math.sign(this.speed)
            }
        }

        // Update rotation using quaternion
        const quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        this.quaternion.multiplyQuaternions(quaternion, this.quaternion);
    }

    update(){

       if(this.helpers)
            this.helpers.forEach(helper => {
                helper.update()
            })

        this.updatePosition()
        this.updateCameraPos()
        this.updateCameraTarget()

    }


}

MyCar.prototype.isGroup = true;

export { MyCar };