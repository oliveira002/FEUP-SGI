import * as THREE from 'three';
import { MyApp } from '../../MyApp.js';

class MyCar extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(app, position=null, speed, acceleration, maxspeed) {
        super();
        this.app = app;
        this.type = 'Group';
        this.pressedKeys = { w: false, a: false, s: false, d: false };
        
        // Position
        this.pos = position ?? new THREE.Vector3(0, 0, 0)

        // Direction (in rad)
        this.dir = new THREE.Vector3(1, 0, 0)
        this.prevDir = this.dir
        this.turningAngle = 2*Math.PI/350

        // speed
        this.speed = 0
        this.minSpeed = 0.08
        this.maxSpeed = 1
        this.brakingFactor = 0.975
        this.dragFactor = 0.995

        // Acceleration
        this.accelerationFactor = 1.02

        this.init()

    }

    init(){
        let geo = new THREE.BoxGeometry(7, 3, 5)
        let mat = new THREE.MeshBasicMaterial({
            color: 0x00aaaa
        })

        this.car = new THREE.Mesh(geo, mat)
        this.car.translateY(3/2)

        this.add(this.car)
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

        if(this.speed < this.minSpeed) this.speed = 0;
        if(this.speed > this.maxSpeed) this.speed = this.maxSpeed

        // Break
        if(this.pressedKeys.s) {
            this.speed = this.brakingFactor * Math.pow(this.speed,2);
        }
        else{ 
            // Accelerate
            if(this.pressedKeys.w) {
                if(this.speed === 0) this.speed = this.minSpeed
                else this.speed *= this.accelerationFactor;
            }
            else this.speed = Math.max(this.speed * this.dragFactor, 0)
        }

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

            //this.rotateY(angle)
        }

        // Update rotation using quaternion
        const quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        this.quaternion.multiplyQuaternions(quaternion, this.quaternion);

        // Update position
        this.position.set(this.pos.x, this.pos.y, this.pos.z);
    }


}

MyCar.prototype.isGroup = true;

export { MyCar };