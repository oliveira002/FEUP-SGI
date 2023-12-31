import * as THREE from 'three';

class MyOpponent extends THREE.Object3D {

    constructor(app, keyPoints, trackCurve) {
        super();
        this.app = app;
        this.type = 'Group';
        this.keyPoints = keyPoints
        this.trackCurve = trackCurve

        this.boxMesh = null
        this.boxMeshSize = 0.5
        this.boxEnabled = false
        this.boxDisplacement = new THREE.Vector3(0, 2, 0)

        this.clock = new THREE.Clock()
        this.mixerTime = 0
        this.mixerPause = false
        this.enableAnimationPosition = true
        this.totalTime = 10
        this.init()
    }

    init() {
        this.buildBox()
        
        const yAxis = new THREE.Vector3(0, 1, 0)
        const normal = new THREE.Vector3(0, 0, 1);
        const keyframeTimes = [];
        const keyframeValues = [];
        const quaternionAng = [];
        const quaternionVal = [];


        for (var i = 0; i < this.keyPoints.length; i++) {
            keyframeTimes.push(i / this.totalTime);
            keyframeValues.push(...this.keyPoints[i]);

            var tg = this.trackCurve.getTangent(i / this.keyPoints.length)
            const angle = normal.angleTo(tg);
            const sign = (tg.x < 0 && tg.z < 0) || (tg.x < 0 && tg.z > 0) ? -1 : 1;
            quaternionAng.push(new THREE.Quaternion().setFromAxisAngle(yAxis, sign * angle));

        }

        const positionKF = new THREE.VectorKeyframeTrack('.position', keyframeTimes, keyframeValues, THREE.InterpolateSmooth);

        quaternionAng.forEach(q => {
            quaternionVal.push(...q)
        });
        
        const quaternionKF = new THREE.QuaternionKeyframeTrack('.quaternion', keyframeTimes, quaternionVal);

        
        const positionClip = new THREE.AnimationClip('positionAnimation', this.animationMaxDuration, [positionKF])
        const rotationClip = new THREE.AnimationClip('rotationAnimation', this.animationMaxDuration, [quaternionKF])
        // Create an AnimationMixer
        this.mixer = new THREE.AnimationMixer(this.boxMesh)

        // Create AnimationActions for each clip
        const positionAction = this.mixer.clipAction(positionClip)
        const rotationAction = this.mixer.clipAction(rotationClip)

        // Play both animations
        positionAction.play()
        rotationAction.play()

    }

    buildBox() {
        let boxMaterial = new THREE.MeshPhongMaterial({
            color: "#ffff77",
            specular: "#000000",
            emissive: "#000000",
            shininess: 90
        })

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(this.boxMeshSize, this.boxMeshSize, this.boxMeshSize + 0.3);
        this.boxMesh = new THREE.Mesh(box, boxMaterial);
        this.boxMesh.rotation.x = -Math.PI / 2;
        this.boxMesh.position.y = this.boxDisplacement.y;

        this.app.scene.add(this.boxMesh)
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
        this.mixer.update(delta)
    }
}

MyOpponent.prototype.isGroup = true;

export { MyOpponent };