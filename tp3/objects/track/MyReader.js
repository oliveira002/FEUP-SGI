import * as THREE from 'three';
import { MyTrack } from './MyTrack.js';

class MyReader extends THREE.Object3D {

    constructor(app, trackName) {
        super();
        this.app = app
        this.type = 'Group';
        this.tracksFilePath = "./objects/track/tracks.json"
        this.track = null
        this.keyframes = []
        this.keyPoints = []
    }

    async initialize(trackName) {
        await this.init(trackName);
    }

    async init(trackName) {
        try {
            const response = await fetch(this.tracksFilePath);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${this.tracksFilePath}`);
            }
            const jsonData = await response.json();

            if (jsonData.hasOwnProperty(trackName)) {
                let object = jsonData[trackName];
                this.createTrack(object.track, object.starting_point_index);
                this.createPowerUps(object.power_ups);
                this.createObstacles(object.obstacles);
                this.createRoutes(object.routes);
                this.createKeyFrames(object.track, 100);
            } else {
                console.error(`Track '${trackName}' not found in the JSON file.`);
            }
        } catch (error) {
            console.error('Error during initialization:', error);
        }
    }

    createTrack(points, starting_point_index){
        let curvePoints = []
        points.forEach(point => {
            curvePoints.push(
                new THREE.Vector3(...point)
            )
        });

        this.track = new MyTrack(curvePoints)
        this.app.scene.add(this.track)
    }

    createPowerUps(powerups){

    }

    createObstacles(obstacles){

    }

    createRoutes(routes){

    }

    createKeyFrames(track, totalTime) {
        let curvePoints = []
        track.forEach(point => {
            curvePoints.push(
                new THREE.Vector3(...point)
            )
        });

        let curve = new THREE.CatmullRomCurve3(curvePoints);
        this.keyPoints = curve.getPoints(100)

        let pointTime = totalTime / 100
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

            this.app.scene.add(sphere)
        }
    }

}

MyReader.prototype.isGroup = true;

export { MyReader };