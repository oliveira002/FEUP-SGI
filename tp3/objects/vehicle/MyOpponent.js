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


        //console.log(keyPoints)
        this.mixer = null
        this.mixerTime = 0
        this.mixerPause = false
        this.enableAnimationPosition = true
        this.totalTime = 20
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

        const totalPoints = this.keyPoints.length
    
        for (var i = 0; i < totalPoints - 1; i++) {
            const startPoint = new THREE.Vector3(...this.keyPoints[i]);
            const endPoint = new THREE.Vector3(...this.keyPoints[i + 1]);
            const direction = new THREE.Vector3().subVectors(endPoint, startPoint).normalize();
            const angle = Math.atan2(direction.x, direction.z);
        
            keyframeTimes.push(i * this.totalTime / (totalPoints - 1));
            keyframeValues.push(...this.keyPoints[i]);
        
            quaternionAng.push(new THREE.Quaternion().setFromAxisAngle(yAxis, angle));
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
    
        const positionClip = new THREE.AnimationClip('positionAnimation', this.totalTime, [positionKF])
        const rotationClip = new THREE.AnimationClip('rotationAnimation', this.totalTime, [quaternionKF])
    
        this.mixer = new THREE.AnimationMixer(this.boxMesh)
    
        const positionAction = this.mixer.clipAction(positionClip)
        const rotationAction = this.mixer.clipAction(rotationClip)
    
        positionAction.play()
        rotationAction.play()
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
    
                    this.wheels = [];
                    this.wheels.push(this.boxMesh.children[0].children[1]);
                    this.wheels.push(this.boxMesh.children[0].children[2]);

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
    }
}

MyOpponent.prototype.isGroup = true;

export { MyOpponent };