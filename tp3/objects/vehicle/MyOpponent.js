import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBB } from 'three/addons/math/OBB.js';



class MyOpponent extends THREE.Object3D {

    constructor(app, keyPoints, trackCurve, model, difficulty) {
        super();
        this.app = app;
        this.type = 'Group';
        this.keyPoints = keyPoints
        this.trackCurve = trackCurve
        this.boxMesh = null
        this.model = model
        this.clock = new THREE.Clock()
        this.wheels = []
        this.cur = 0

        this.mixer = null
        this.wheel1Mixer = null
        this.wheel2Mixer = null
        this.mixerTime = 0
        this.mixerPause = false
        this.enableAnimationPosition = true
        this.difficulty = difficulty

        const difficultyMap = {"easy": 3, "normal": 2, "hard": 1}
        this.totalTime = difficultyMap[this.difficulty] * 20 
        this.init()
    }

    async init() {
        await this.buildBox()
    
        const yAxis = new THREE.Vector3(0, 1, 0)
        const normal = new THREE.Vector3(0, 0, 1);
        const keyframeTimes = [];
        const keyframeValues = [];
        const quaternionAng = [];
        const quaternionVal = [];
        const wheelKeyframeTimes = [];
        const wheelKeyframeValues = [];

        const totalPoints = this.keyPoints.length

        let initRot = 0
    
        for (var i = 0; i < totalPoints - 1; i++) {
            const startPoint = new THREE.Vector3(...this.keyPoints[i]);
            const endPoint = new THREE.Vector3(...this.keyPoints[i + 1]);
            const nextPoint = new THREE.Vector3(...this.keyPoints[i + 2] || endPoint);
        
            const direction1 = new THREE.Vector3().subVectors(endPoint, startPoint).normalize();
            const direction2 = new THREE.Vector3().subVectors(nextPoint, endPoint).normalize();
            const direction = new THREE.Vector3().subVectors(endPoint, startPoint).normalize();
            const angle = Math.atan2(direction.x, direction.z);

            const curvature = direction1.cross(direction2).y;
        
            keyframeTimes.push(i * this.totalTime / (totalPoints - 1));
            wheelKeyframeTimes.push(i * this.totalTime / (totalPoints - 1));
            keyframeValues.push(...this.keyPoints[i]);
            quaternionAng.push(new THREE.Quaternion().setFromAxisAngle(yAxis, angle));
        

            if (Math.abs(curvature) < 0.02) {
                initRot = Math.sign(initRot) * -0.01;
            } else {
                initRot += curvature / 2;
        
                if (Math.abs(initRot) >= Math.PI / 5) {
                    initRot = Math.sign(initRot) * Math.PI / 5;
                }
            }
        
            wheelKeyframeValues.push(initRot);
        }
        
        const lastPoint = new THREE.Vector3(...this.keyPoints[totalPoints - 1]);
        keyframeTimes.push((totalPoints - 1) * this.totalTime / (totalPoints - 1));
        keyframeValues.push(...this.keyPoints[totalPoints - 1]);
        const lastDirection = new THREE.Vector3().subVectors(lastPoint, this.keyPoints[totalPoints - 2]).normalize();
        const lastAngle = Math.atan2(lastDirection.x, lastDirection.z);
        quaternionAng.push(new THREE.Quaternion().setFromAxisAngle(yAxis, lastAngle));

        quaternionAng.forEach(q => {
            quaternionVal.push(...q.toArray());
        });

        const rot = (this.model === "Nissan S15") ?  '.rotation[z]' : '.rotation[y]'
    
        const positionKF = new THREE.VectorKeyframeTrack('.position', keyframeTimes, keyframeValues, THREE.InterpolateSmooth);
        const quaternionKF = new THREE.QuaternionKeyframeTrack('.quaternion', keyframeTimes, quaternionVal, THREE.InterpolateSmooth);
        const wheelRotationKF = new THREE.NumberKeyframeTrack(rot, wheelKeyframeTimes, wheelKeyframeValues);
    
        const positionClip = new THREE.AnimationClip('positionAnimation', this.totalTime, [positionKF])
        const rotationClip = new THREE.AnimationClip('rotationAnimation', this.totalTime, [quaternionKF])
        const wheelsClip = new THREE.AnimationClip('wheelsAnimation', this.totalTime, [wheelRotationKF])
    
        this.mixer = new THREE.AnimationMixer(this.boxMesh)
    
        this.positionAction = this.mixer.clipAction(positionClip)
        this.rotationAction = this.mixer.clipAction(rotationClip)
        this.wheel1Action = this.wheel1Mixer.clipAction(wheelsClip)
        this.wheel2Action = this.wheel2Mixer.clipAction(wheelsClip)
    }

    startOpponent() {
        this.positionAction.play()
        this.rotationAction.play()
        this.wheel1Action.play()
        this.wheel2Action.play()
    }

    buildBox() {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            switch(this.model) {
                case "Nissan S15":
                    loader.load(
                        'images/Nissan_Silvia_S15.glb',
                        (gltf) => {
                            this.boxMesh = gltf.scene;
                            this.boxMesh.name = "car";
                            this.boxMesh.position.set(0, 0, 0);
                            this.boxMesh.scale.set(0.8,0.8,0.8)
                            //this.boxMesh.scale.set(0.7,0.7,0.7)
            
                            this.wheels.push(this.boxMesh.children[0].children[1]);
                            this.wheels.push(this.boxMesh.children[0].children[2]);
                            
                            this.wheel1Mixer = new THREE.AnimationMixer(this.wheels[0]); 
                            this.wheel2Mixer = new THREE.AnimationMixer(this.wheels[1]);
                            this.app.scene.add(this.boxMesh);
        
                            this.boxMesh.rotation.y -= -Math.PI / 2

                            this.bbox = new THREE.Box3()  
                            this.bbhelper = new THREE.Box3Helper( this.bbox, 0xffff00 );
                            this.add( this.bbhelper );
                            this.boxMesh.userData.obb = new OBB().fromBox3(this.bbox);
            
                            console.log('Model loaded successfully');
                            resolve(this.boxMesh);
                        },
                        (xhr) => {
                            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
                        },
                        (error) => {
                            console.log('An error happened', error);
                            reject(error);
                        }
                    );
                break;

                case "Lambo":
                    loader.load(
                        'images/lambo.glb',
                        (gltf) => {
                            this.boxMesh = gltf.scene
                            this.boxMesh.name = "car"
                            this.boxMesh.scale.set(0.005,0.005,0.005)
            
                            this.wheels.push(this.boxMesh.children[2]);
                            this.wheels.push(this.boxMesh.children[3]);

                            this.wheels.forEach(wheel => {
                                const wheelCenter = new THREE.Vector3();
                                wheel.geometry.computeBoundingBox();
                                wheel.geometry.boundingBox.getCenter(wheelCenter);
                            
                                const offset = wheelCenter.clone().sub(wheel.position);
                            
                                wheel.geometry.center();
                            
                                wheel.position.add(offset);
                            });
                            
                            this.wheel1Mixer = new THREE.AnimationMixer(this.wheels[0]); 
                            this.wheel2Mixer = new THREE.AnimationMixer(this.wheels[1]);
                            this.app.scene.add(this.boxMesh);
        
                            this.boxMesh.rotation.y -= -Math.PI / 2
                            this.bbox = new THREE.Box3()  
                            this.bbhelper = new THREE.Box3Helper( this.bbox, 0xffff00 );
                            this.add( this.bbhelper );
                            this.boxMesh.userData.obb = new OBB().fromBox3(this.bbox);
            
                            console.log('Model loaded successfully');
                            resolve(this.boxMesh);
                        },
                        (xhr) => {
                            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
                        },
                        (error) => {
                            console.log('An error happened', error);
                            reject(error);
                        }
                    );
                    break;
            }
        });
        
    }
    setMixerTime() {
        this.mixer.setTime(this.mixerTime)
    }

    checkAnimationStateIsPause() {
        if (this.mixerPause) {
            this.mixer.timeScale = 0
            this.wheel1Mixer.timeScale = 0
            this.wheel2Mixer.timeScale = 0
        } else { 
            this.mixer.timeScale = 1
            this.wheel1Mixer.timeScale = 1
            this.wheel2Mixer.timeScale = 1
        }   
    }


    checkTracksEnabled() {

        const actions = this.mixer._actions
        for (let i = 0; i < actions.length; i++) {
            const track = actions[i]._clip.tracks[0]

            if (track.name === '.position' && this.enableAnimationPosition === false) {
                actions[i].stop()
            }
            else {
                if (!actions[i].isRunning())
                    actions[i].play()
            }
        }
    }


    update() {
        if(this.bbox && this.boxMesh && this.boxMesh.userData.obb) {
            this.bbox.setFromObject(this.boxMesh);
            this.boxMesh.userData.obb.fromBox3(this.bbox); 
        }
        const delta = this.clock.getDelta()
        if(this.mixer) {
            this.mixer.update(delta)
        }

        if (this.wheel1Mixer) {
            this.wheel1Mixer.update(delta);
        }

        if (this.wheel2Mixer) {
            this.wheel2Mixer.update(delta);
        }
        if(this.wheel1Mixer && this.wheel2Mixer && this.mixer) {
            this.checkAnimationStateIsPause()
        }
    }

    getEffect() {
        return "Opponent";
    }
}

MyOpponent.prototype.isGroup = true;

export { MyOpponent };