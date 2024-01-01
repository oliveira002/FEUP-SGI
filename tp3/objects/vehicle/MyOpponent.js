import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


class MyOpponent extends THREE.Object3D {

    constructor(app, keyPoints, trackCurve) {
        super();
        this.app = app;
        this.type = 'Group';
        this.keyPoints = keyPoints
        this.trackCurve = trackCurve
        this.boxMesh = null
        this.clock = new THREE.Clock()
        this.wheels = []
        this.cur = 0


        //console.log(keyPoints)
        this.mixer = null
        this.wheel1Mixer = null
        this.wheel2Mixer = null
        this.mixerTime = 0
        this.mixerPause = false
        this.enableAnimationPosition = true
        this.totalTime = 50
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
        
                // Limit the rotation
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
    
        const positionKF = new THREE.VectorKeyframeTrack('.position', keyframeTimes, keyframeValues, THREE.InterpolateSmooth);
        const quaternionKF = new THREE.QuaternionKeyframeTrack('.quaternion', keyframeTimes, quaternionVal, THREE.InterpolateSmooth);
        const wheelRotationKF = new THREE.NumberKeyframeTrack('.rotation[z]', wheelKeyframeTimes, wheelKeyframeValues);
    
        const positionClip = new THREE.AnimationClip('positionAnimation', this.totalTime, [positionKF])
        const rotationClip = new THREE.AnimationClip('rotationAnimation', this.totalTime, [quaternionKF])
        const wheelsClip = new THREE.AnimationClip('wheelsAnimation', this.totalTime, [wheelRotationKF])
    
        this.mixer = new THREE.AnimationMixer(this.boxMesh)
    
        const positionAction = this.mixer.clipAction(positionClip)
        const rotationAction = this.mixer.clipAction(rotationClip)
        const wheel1Action = this.wheel1Mixer.clipAction(wheelsClip)
        const wheel2Action = this.wheel2Mixer.clipAction(wheelsClip)


        positionAction.play()
        rotationAction.play()
        wheel1Action.play()
        wheel2Action.play()
    }

    buildBox() {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.load(
                'images/Nissan_Silvia_S15.glb',
                (gltf) => {
                    this.boxMesh = gltf.scene;
                    this.boxMesh.name = "car";
                    this.boxMesh.position.set(0, 0, 0);
    
                    this.wheels.push(this.boxMesh.children[0].children[1]);
                    this.wheels.push(this.boxMesh.children[0].children[2]);
                    
                    this.wheel1Mixer = new THREE.AnimationMixer(this.wheels[0]); // Assuming you have one wheel for simplicity
                    this.wheel2Mixer = new THREE.AnimationMixer(this.wheels[1]);
                    this.app.scene.add(this.boxMesh);

                    this.boxMesh.rotation.y -= -Math.PI / 2
    
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
        });
    }
    setMixerTime() {
        this.mixer.setTime(this.mixerTime)
    }

    checkAnimationStateIsPause() {
        if (this.mixerPause)
            this.mixer.timeScale = 0
        else
            this.mixer.timeScale = 1
    }


    /**
     * Start/Stop if position or rotation animation track is running
     */
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
    }
}

MyOpponent.prototype.isGroup = true;

export { MyOpponent };