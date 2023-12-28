import * as THREE from 'three';
import { MyTrack } from './MyTrack.js';

class MyReader extends THREE.Object3D {

    constructor(app, trackName) {
        super();
        this.app = app
        this.type = 'Group';
        this.tracksFilePath = "./objects/track/tracks.json"
        this.track = null
        
        this.init(trackName)
    }

    init(trackName) {

        fetch(this.tracksFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch ${this.tracksFilePath}`);
            }
            return response.json();
        })
        .then(jsonData => {
            if (jsonData.hasOwnProperty(trackName)) {

                let object = jsonData[trackName]

                this.createTrack(object.track, object.starting_point_index);
                this.createPowerUps(object.power_ups);
                this.createObstacles(object.obstacles);
                this.createRoutes(object.routes);

            } else {
                console.error(`Track '${trackName}' not found in the JSON file.`);
            }
        })
    }

    createTrack(points, starting_point_index){
        let curvePoints = []
        points.forEach(point => {
            curvePoints.push(
                new THREE.Vector3(...point)
            )
        });

        this.track = new MyTrack(curvePoints)
        this.track.translateY(4)
        this.app.scene.add(this.track)
    }

    createPowerUps(powerups){

    }

    createObstacles(obstacles){

    }

    createRoutes(routes){

    }

}

MyReader.prototype.isGroup = true;

export { MyReader };