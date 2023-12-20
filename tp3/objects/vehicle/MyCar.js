import * as THREE from 'three';
import { MyApp } from '../../MyApp.js';

class MyCar extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(app, position=null, velocity, acceleration, maxVelocity) {
        super();
        this.app = app;
        this.type = 'Group';
        this.pressedKeys = { w: false, a: false, s: false, d: false };
        
        // Position
        this.pos = position ?? new THREE.Vector3(0, 0, 0)

        // Direction (in rad)
        this.dir = new THREE.Vector3(1, 0, 0)
        this.angle = 0
        this.rotationFactor = 2*Math.PI/100

        // Velocity
        this.velocity = velocity ?? 1
        this.maxVelocity = 1
        this.brakingFactor = 0.95

        // Acceleration
        this.acceleration = acceleration ?? 0

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
        // Drive
        if(this.pressedKeys.w) this.pos.x += this.velocity;
        else {}

        // Break
        if(this.pressedKeys.s) this.velocity *= this.brakingFactor;

        // Rotate Left or Right
        if(this.pressedKeys.a) this.angle += this.rotationFactor;
        if(this.pressedKeys.d) this.angle -= this.rotationFactor;

        
    }


}

MyCar.prototype.isGroup = true;

export { MyCar };