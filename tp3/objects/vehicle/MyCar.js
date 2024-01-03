import * as THREE from 'three';
import { MyApp } from '../../MyApp.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { degToRad } from '../../utils.js';
import { OBB } from 'three/addons/math/OBB.js';
import { MyPowerUp } from '../track/MyPowerUp.js';
import { State } from '../../MyGame.js';
import { MyCheckpoint } from '../track/MyCheckpoint.js';

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
        this.effects = []
        this.name = name
        this.loaded = false
        this.raycasters = []
        this.rayHelpers = []
        this.track = track
        this.wheelsOut = []
        this.meshes = []
        this.lastIntersection = null
        this.isCollidable = true
        this.isOffroad = false
        this.hasBrakes = true
        this.inverted = false
        this.effectTime = 5000

        this.wheels = []
        this.modelMapping = {}
        this.model = model
        
        // Position
        this.pos = position ?? new THREE.Vector3(0, 0, 0)

        // Direction (in rad)
        this.dir = new THREE.Vector3(0, 0, 1)
        this.prevDir = this.dir
        this.turningAngle = 2*Math.PI/350

        // speed
        this.speed = 0
        this.minSpeed = 0.008
        this.maxmaxspeed = 0.1
        this.maxSpeed = this.maxmaxspeed
        this.brakingFactor = 0.985
        this.dragFactor = 0.995

        // Acceleration
        this.accelerationFactor = 1.01

        this.collidedObjects = new Set();
        this.init()

    }

    init(){
        const loader = new GLTFLoader();
        if(this.model === "Nissan S15") {
            loader.load(
                'images/Nissan_Silvia_S15.glb',
                (gltf) => {
                    this.car = gltf.scene;
                    this.car.name = "car";
                    this.car.position.set(0,0,0)
                    
                    //this.car.position.set(0.02, -0.4, -0.72);
            
                    let meshes = []
            
                    this.car.traverse((o) => {
                        if (o.isMesh) {
                            let originalGeo = o.geometry;
                            let scaledGeo = originalGeo.clone();
                            let mesh = new THREE.Mesh(scaledGeo, o.material);
            
                            mesh.position.set(this.car.position.x - 0.02, this.car.position.y + 0.4, this.car.position.z + 0.72);
                            //mesh.geometry.computeBoundsTree();
                            meshes.push(mesh)
                        }
                    });
                    
                    this.meshes = meshes
                    this.add(this.car);
                    
                    this.wheels.push(this.car.children[0].children[1]);
                    this.wheels.push(this.car.children[0].children[2]);

                    this.wheelsOut.push(this.car.children[0].children[1]);
                    this.wheelsOut.push(this.car.children[0].children[2])
                    this.wheelsOut.push(this.car.children[0].children[3]);
                    this.wheelsOut.push(this.car.children[0].children[4]);

                    this.wheelsOut.forEach(wheel => {
                        const raycaster = new THREE.Raycaster();
                        raycaster.ray.direction.set(0, -1, 0);
                        raycaster.ray.origin.copy(wheel.position);
                        this.raycasters.push(raycaster);

                        const arrowHelper = new THREE.ArrowHelper(
                            raycaster.ray.direction,
                            wheel.position,
                            2, // Length of the arrow
                            0x00ff00 // Color of the arrow (green)
                        );
                        this.rayHelpers.push(arrowHelper);
                        this.add(arrowHelper);
                        
                    });

                    this.car.scale.set(0.8,0.8,0.8)

                    this.bbox = new THREE.Box3()
                    
                    this.bbhelper = new THREE.Box3Helper( this.bbox, 0xffff00 );
                    this.add( this.bbhelper );

                    this.car.userData.obb = new OBB().fromBox3(this.bbox);

                },
                (xhr) => {
                    //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
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
                    this.car.scale.set(0.005,0.005,0.005)

                    let meshes = []
    
                    this.car.traverse((o) => {
                        if (o.isMesh) {
                            let geo = o.geometry;
                            let scaledGeo = geo.clone();
                            
                            scaledGeo.scale(this.car.scale.x, this.car.scale.y, this.car.scale.z);      
            
                            let mesh = new THREE.Mesh(scaledGeo, o.material);
                            mesh.position.copy(o.position);
                            mesh.rotation.copy(o.rotation);
                            mesh.scale.copy(o.scale);
                            meshes.push(mesh)
        
                        }
                    });
                    this.meshes = meshes

                    this.add(this.car); 

                    this.wheels.push(this.car.children[2])
                    this.wheels.push(this.car.children[3])

                    this.wheelsOut.push(this.car.children[2])
                    this.wheelsOut.push(this.car.children[3])
                    this.wheelsOut.push(this.car.children[4])
                    this.wheelsOut.push(this.car.children[5])

                    
                    this.wheelsOut.forEach(wheel => {
                        const wheelCenter = new THREE.Vector3();
                        wheel.geometry.computeBoundingBox();
                        wheel.geometry.boundingBox.getCenter(wheelCenter);
                    
                        const offset = wheelCenter.clone().sub(wheel.position);
                    
                        wheel.geometry.center();
                    
                        wheel.position.add(offset);
                    });


                    this.wheelsOut.forEach(wheel => {
                        const wheelWorldPosition = new THREE.Vector3();
                        wheel.getWorldPosition(wheelWorldPosition); 
                        const raycaster = new THREE.Raycaster();
                        raycaster.ray.direction.set(0, -1, 0);
                        raycaster.ray.origin.copy(wheelWorldPosition);
                        this.raycasters.push(raycaster);

                        const arrowHelper = new THREE.ArrowHelper(
                            raycaster.ray.direction,
                            wheelWorldPosition,
                            2, // Length of the arrow
                            0x00ff00 // Color of the arrow (green)
                        );
                        this.rayHelpers.push(arrowHelper);
                        this.add(arrowHelper);
                    });

                    this.bbox = new THREE.Box3()
                    
                    this.bbhelper = new THREE.Box3Helper( this.bbox, 0xffff00 );
                    this.add( this.bbhelper );

                    this.car.userData.obb = new OBB().fromBox3(this.bbox);
                },
                (xhr) => {
                    //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                (error) => {
                    console.log('An error happened', error);
                }
            );
        }

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
        cameraPos.add(this.car.position)

        this.camera.position.set(...cameraPos)

    }

    updateCameraTarget(){
        if(this.car) {
            this.app.targets[this.name] = new THREE.Vector3(
                this.car.position.x, 
                this.car.position.y, 
                this.car.position.z
            )
            this.camera.lookAt(this.app.targets[this.name])
        }
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
        if(this.pressedKeys.space && this.hasBrakes) {
            this.speed *= this.brakingFactor
        }
        else{ 
            // Accelerate
            if(this.pressedKeys.w && this.inverted) {
                if(this.speed === 0) this.speed = -this.minSpeed
                if(this.speed < 0) this.speed *= this.accelerationFactor;
                if(this.speed > 0 && this.hasBrakes) this.speed *= this.brakingFactor
                else this.speed = Math.sign(this.speed) * Math.max(Math.abs(this.speed * this.dragFactor), 0)
            }
            else if(this.pressedKeys.w) {
                if(this.speed === 0) this.speed = this.minSpeed
                if(this.speed < 0) this.speed *= this.brakingFactor
                if(this.speed > 0) this.speed *= this.accelerationFactor;
            }
            else if(this.pressedKeys.s && this.inverted) {
                if(this.speed === 0) this.speed = this.minSpeed
                if(this.speed < 0) this.speed *= this.brakingFactor
                if(this.speed > 0) this.speed *= this.accelerationFactor;
            }
            else if(this.pressedKeys.s) {
                if(this.speed === 0) this.speed = -this.minSpeed
                if(this.speed < 0) this.speed *= this.accelerationFactor;
                if(this.speed > 0 && this.hasBrakes) this.speed *= this.brakingFactor
                else this.speed = Math.sign(this.speed) * Math.max(Math.abs(this.speed * this.dragFactor), 0)
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
        this.car.position.set(this.pos.x, this.pos.y, this.pos.z);

        this.updateRaycastersPosition()
        this.boundingBoxPosition()
    }

    updateRaycastersPosition() {
        const car = this;
      
        this.wheelsOut.forEach((wheel, index) => {
          const wheelWorldPosition = new THREE.Vector3();
          wheel.getWorldPosition(wheelWorldPosition); 
      
          const raycaster = this.raycasters[index];
          raycaster.ray.origin.copy(wheelWorldPosition); 
          const rotationMatrix = new THREE.Matrix4();
          rotationMatrix.extractRotation(car.matrixWorld);
          raycaster.ray.direction.applyMatrix4(rotationMatrix);
        });
    }

    updateSpeedBasedOnTrack(){

        if(!this.isOffroad){

            let insideN = 4

            this.raycasters.forEach((raycaster, index) => {
                const intersections = raycaster.intersectObject(this.track);
                if (intersections.length > 0) {
                    //console.log(`Wheel ${index + 1} is on the track.`);
                    this.rayHelpers[index].setDirection(raycaster.ray.direction);
                    this.rayHelpers[index].setColor(0x00ff00);
                } else {
                    insideN -= 1
                    //console.log(`Wheel ${index + 1} is off the track.`);
                    this.rayHelpers[index].setDirection(raycaster.ray.direction);
                    this.rayHelpers[index].setColor(0xff0000); // Change color to red for off-track
                }
            });
                
            
            this.maxSpeed = this.maxmaxspeed/2 + (0.25*insideN)*(this.maxmaxspeed/2)
            return
        }
        this.maxSpeed = this.maxmaxspeed
    }

    boundingBoxPosition() {
        this.bbox.setFromObject(this.car);
        this.car.userData.obb.fromBox3(this.bbox);
    }

    updateHelper(){

    }


    updateAngle(){
        let angle = 0;
        let wheelAngle = 0;


        if(this.speed !== 0){
            if(this.pressedKeys.a && !this.pressedKeys.d && this.inverted) {
                this.dir.applyAxisAngle(new THREE.Vector3(0,1,0), -this.turningAngle * Math.sign(this.speed));
                angle = -this.turningAngle * Math.sign(this.speed)
            }
            else if(this.pressedKeys.a && !this.pressedKeys.d) {
                this.dir.applyAxisAngle(new THREE.Vector3(0,1,0), this.turningAngle * Math.sign(this.speed));
                angle = this.turningAngle * Math.sign(this.speed)
            }
            
            if(this.pressedKeys.d && !this.pressedKeys.a && this.inverted) {
                this.dir.applyAxisAngle(new THREE.Vector3(0,1,0), this.turningAngle * Math.sign(this.speed));
                angle = this.turningAngle * Math.sign(this.speed)
            }
            else if(this.pressedKeys.d && !this.pressedKeys.a) {
                this.dir.applyAxisAngle(new THREE.Vector3(0,1,0), -this.turningAngle * Math.sign(this.speed));
                angle = -this.turningAngle * Math.sign(this.speed)
            }
        }
        else {
            if(this.pressedKeys.a && !this.pressedKeys.d && this.inverted) {
                wheelAngle = -this.turningAngle
            }
            else if(this.pressedKeys.a && !this.pressedKeys.d) {
                wheelAngle = this.turningAngle 
            }

            if(this.pressedKeys.d && !this.pressedKeys.a && this.inverted) {
                wheelAngle = this.turningAngle 
            }
            else if(this.pressedKeys.d && !this.pressedKeys.a) {
                wheelAngle = -this.turningAngle 
            }
        }

        const quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        this.car.quaternion.multiplyQuaternions(quaternion, this.car.quaternion);

        
        this.wheels.forEach(wheel => {
            this.rotateWheel(wheel, angle, wheelAngle)
        });

    }

    rotateWheel(wheel, angle, wheelAngle) {
        switch(this.model) {
            case "Nissan S15":
                if(this.speed === 0 && wheelAngle != 0) {
                    wheelAngle = wheelAngle
                }
                
                else if(angle === 0) {
                    wheelAngle = Math.sign(wheel.rotation.z) * -0.01
                }
                else {
                    wheelAngle = angle / 2
                }
            
                
                if(Math.abs(wheel.rotation.z + wheelAngle) > Math.PI / 5) {
                    wheel.rotation.z = Math.sign(wheelAngle) * Math.PI / 5
                }
                else {
                    wheel.rotateZ(wheelAngle)
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
                
    

                if(Math.abs(wheel.rotation.y + wheelAngle) > Math.PI / 5) {
                    wheel.rotation.y = Math.sign(wheelAngle) * Math.PI / 5
                }
                else {
                    wheel.rotateY(wheelAngle)
                }
        }
    }

    update(){
        this.updatePosition()
        this.updateCameraPos()
        this.updateCameraTarget()
        this.updateAttributesBasedOnEffects()
        this.updateSpeedBasedOnTrack()
        this.updateEffects()
    }

    updateEffects() {
        this.effects.forEach( e => {
            e.updateTimer()
        })
    }

    updateAttributesBasedOnEffects(){
        let tempo = ["Speed","NoClip", "Offroad"]

        this.effects.forEach((e,i) => {
            if(tempo.includes(e.name)) this.effectTime = 10000
            else this.effectTime = 5000
            if(e.elapsedTime < this.effectTime){
                switch(e.name){
                    case "Speed":{
                        this.maxmaxspeed = 0.15
                        this.maxSpeed = this.maxmaxspeed
                        break;
                    }
                    case "NoClip":{
                        this.isCollidable = false
                        break;
                    }
                    case "Offroad":{
                        this.isOffroad = true
                        break;
                    }
                    case "Oil":{
                        this.hasBrakes = false
                        break;
                    }
                    case "Caution":{
                        this.inverted = true
                        break;
                    }
                    case "Banana":{
                        this.maxmaxspeed = 0.05 
                        this.maxSpeed = this.maxmaxspeed
                        break;
                    }
                }
            }
            else {
                this.effects.splice(i, 1)
                switch(e.name){
                    case "Speed":{
                        this.maxmaxspeed = 0.1
                        this.maxSpeed = this.maxmaxspeed
                        break;
                    }
                    case "NoClip":{
                        this.isCollidable = true
                        break;
                    }
                    case "Offroad":{
                        this.isOffroad = false
                        break;
                    }
                    case "Oil":{
                        this.hasBrakes = true
                        break;
                    }
                    case "Caution":{
                        this.inverted = false
                        break;
                    }
                    case "Banana":{
                        this.maxmaxspeed = 0.1
                        this.maxSpeed = this.maxmaxspeed
                        break;
                    }
                }
            }
        })
    }

    checkCollisions(objects) {
        objects.forEach((obj) => {
            // Check if the object has already been collided with
            if (this.collidedObjects.has(obj.uuid)) {
                let intersects;
                if (obj instanceof MyPowerUp)
                    intersects = this.car.userData.obb.intersectsBox3(obj.geometry.boundingBox);
                else if (obj instanceof MyCheckpoint)
                    intersects = this.car.userData.obb.intersectsBox3(obj.children[0].geometry.boundingBox);
                else
                    intersects = this.car.userData.obb.intersectsBox3(obj.boundingBox);

                if (!intersects) {
                    // Remove the object from the set if it's no longer intersected
                    this.collidedObjects.delete(obj.uuid);
                }
            } else {
                // Object has not been collided with yet
                let intersects;
                if (obj instanceof MyPowerUp)
                    intersects = this.car.userData.obb.intersectsBox3(obj.geometry.boundingBox);
                else if (obj instanceof MyCheckpoint)
                    intersects = this.car.userData.obb.intersectsBox3(obj.children[0].geometry.boundingBox);
                else
                    intersects = this.car.userData.obb.intersectsBox3(obj.boundingBox);

                if (intersects) {
                    // Mark the object as collided
                    this.collidedObjects.add(obj.uuid);

                    if (obj instanceof MyCheckpoint) {
                        console.log("Checkpoint:", obj.number);
                        return;
                    }

                    if (!obj.disabled) {
                        if (!this.isCollidable && !(obj instanceof MyPowerUp)) return;

                        let effect = obj.getEffect();

                        var efeito = new MyEffect(effect);
                        efeito.startTimer();
                        this.effects.push(efeito);

                        if (obj instanceof MyPowerUp) {
                            this.app.contents.game.state = State.CHOOSE_OBSTACLE
                            obj.startTimer()

                            this.app.contents.reader.powerups.forEach(pu => {
                                pu.stopTimer()
                            })

                            this.stopTimerEffects()

                            this.app.contents.hud.stopTimer()
                            this.app.contents.opponent.mixerPause = true
                            this.app.contents.pickableObjs = this.app.contents.obsGarage.pickableObjs
                            this.app.scene.add(this.app.contents.obsGarage)
                            this.app.setActiveCamera('Obstacles')   
                        }
                    }
                }
            }
        });
    }


    stopTimerEffects() {
        this.effects.forEach(e => {
            e.stopTimer()
        });
    }

    resumeTimerEffects() {
        this.effects.forEach(e => {
            e.resumeTimer()
        });
    }
}

MyCar.prototype.isGroup = true;

export { MyCar };

class MyEffect {

    constructor(name) {
        this.name = name
        this.startTime = null
        this.elapsedTime = 0
    }

    startTimer() {
        this.startTime = Date.now();
        this.elapsedTime = 0;
        this.updateTimer(); 
    }

    stopTimer() {
        if (this.startTime !== null) {
            this.elapsedTime += Date.now() - this.startTime;
            this.startTime = null;
        }
    }

    resumeTimer() {
        if (this.startTime === null) {
            this.startTime = Date.now();
            this.updateTimer(); 
        }
    }

    updateTimer() {
        if (this.startTime !== null) {
            const currentTime = Date.now();
            this.elapsedTime += currentTime - this.startTime;
            this.startTime = currentTime;
        }
    }
}