import * as THREE from 'three';
import { MyTrack } from './MyTrack.js';
import { tracks } from './tracks.js';
import { MyPowerUp } from './MyPowerUp.js';




class MyReader extends THREE.Object3D {

    constructor(app, trackName) {
        super();
        this.app = app
        this.type = 'Group';
        this.track = null
        this.trackCurve = null
        this.keyframes = []
        this.keyPoints = []
        this.powerups = []

        this.init(trackName);
    }

    init(trackName) {

        let object = tracks[trackName];

        this.createTrack(object.track, object.starting_point_index);
        this.createPowerUps(object.power_ups);
        this.createObstacles(object.obstacles);
        this.createKeyFrames(object.track, 20);

    }

    createTrack(points, starting_point_index){
        let curvePoints = []
        points.forEach(point => {
            curvePoints.push(
                new THREE.Vector3(...point)
            )
        });

        this.track = new MyTrack(curvePoints)
        this.add(this.track)
    }

    createPowerUps(powerup_coords){
        powerup_coords.forEach(coords => {

            let radius = 5
            let powerup = new MyPowerUp(radius, coords)
            //powerup.position.set(...coords)

            this.powerups.push(powerup)
            this.add(powerup)
        });
    }

    createObstacles(obstacles){

    }

    createKeyFrames(track, totalTime) {
        let curvePoints = []
        track.forEach(point => {
            curvePoints.push(
                new THREE.Vector3(...point)
            )
        });

        this.trackCurve = new THREE.CatmullRomCurve3(curvePoints);
        this.keyPoints = this.trackCurve.getSpacedPoints(400)

        let pointTime = totalTime / 400
        let curTime = 0
        this.keyPoints.forEach((point, i) => {
            this.keyframes.push({time: curTime, value: point})
            curTime += pointTime
        });

        this.spline = new THREE.CatmullRomCurve3(this.keyframes.map(kf => kf.value));

        for (let i = 0; i < this.keyPoints.length; i++) {
            const geometry = new THREE.SphereGeometry(1, 32, 32);
            const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
            const sphere = new THREE.Mesh(geometry, material);
            sphere.scale.set(0.2, 0.2, 0.2)
            sphere.position.set(... this.keyPoints[i])

            //this.add(sphere)
        }
    }

    update(){
        this.powerups.forEach(powerup => {
            powerup.update()
        })
    }

}

MyReader.prototype.isGroup = true;

export { MyReader };